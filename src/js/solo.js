// 혼자하기 모드 : 메뉴 -> 레벨1 -> (통과) -> 레벨2 -> 결과
window.MG = window.MG || {};

MG.startSolo = function () {
  const boardEl = MG.$('#board');
  const obstacleEl = MG.$('#obstacle-layer');

  let current = null;
  let results = {};

  function runLevel(level) {
    if (current) current.stop();
    MG.hud.hideOverlay();
    MG.$('#rival-panel').hidden = true;
    MG.hud.setLevel('LEVEL ' + level);
    MG.showScreen('play');

    current = MG.createGame({
      boardEl,
      obstacleEl,
      level,
      hooks: {
        onState: (state) => MG.hud.render(state),
        onEnd: (result) => {
          results[level] = result;

          if (!result.cleared) {
            showResult(false, level);
            return;
          }

          if (level === 1) {
            MG.hud.overlay('LEVEL 1 통과!');
            setTimeout(() => runLevel(2), 1400);
          } else {
            showResult(true, level);
          }
        }
      }
    });

    current.start();
  }

  function showResult(success, failedLevel) {
    MG.hud.hideOverlay();
    MG.$('#result-title').textContent = success ? '클리어!' : '실패';
    MG.$('#result-title').className = success ? 'big success' : 'big fail';

    const lines = [];
    [1, 2].forEach((lv) => {
      const r = results[lv];
      if (!r) return;
      lines.push(
        `레벨 ${lv} — ${MG.gradeLabel(r.grade)} · ${r.time}초 · ${r.flips}회`
      );
    });
    if (!success) {
      lines.push(`레벨 ${failedLevel}에서 실패했어요.`);
    }

    MG.$('#result-detail').innerHTML = lines.map((t) => `<p>${t}</p>`).join('');
    MG.showScreen('result');
  }

  function goMenu() {
    if (current) current.stop();
    MG.hud.hideOverlay();
    results = {};
    MG.showScreen('menu');
  }

  MG.$('#btn-solo').addEventListener('click', () => {
    results = {};
    runLevel(1);
  });

  MG.$('#btn-versus').addEventListener('click', () => {
    MG.bridge.openVersus();
  });

  // 다시하기는 항상 레벨 1부터
  MG.$('#btn-retry').addEventListener('click', () => {
    results = {};
    runLevel(1);
  });

  MG.$('#btn-menu').addEventListener('click', goMenu);

  MG.showScreen('menu');
};
