// 경쟁 모드 : 한 화면에 창 2개, 같은 카드 배치 / 같은 장애물로 동시에 시작
//  - 두 창은 같은 index.html 을 ?mode=versus&player=1 / 2 로 열어서 쓴다
//  - 1번 플레이어 창이 "씨앗(seed)"을 뽑아서 보내면, 두 창이 똑같은 판을 만든다
window.MG = window.MG || {};

MG.startVersus = function (myPlayer) {
  const boardEl = MG.$('#board');
  const obstacleEl = MG.$('#obstacle-layer');
  const level = MG.config.versusLevel;

  let current = null;
  let myResult = null;
  let rivalResult = null;
  let rivalMet = false;
  let roundStarted = false;

  MG.$('#rival-panel').hidden = false;
  MG.hud.setLevel(myPlayer + '번 플레이어');
  MG.hud.renderRival(null);
  MG.showScreen('play');
  MG.hud.overlay('상대 창 기다리는 중…');

  function send(message) {
    MG.bridge.send({ ...message, from: myPlayer });
  }

  // 1번 창이 판을 정하는 역할
  // 보낸 메시지는 자기 자신한테는 안 돌아오니까, 내 판도 여기서 같이 시작해야 함
  function hostStart() {
    if (myPlayer !== 1) return;
    const seed = MG.makeSeed();
    send({ type: 'start', seed });
    beginRound(seed);
  }

  function beginRound(seed) {
    if (current) current.stop();
    myResult = null;
    rivalResult = null;
    roundStarted = true;

    MG.hud.renderRival(null);
    MG.showScreen('play');

    const rand = MG.createRandom(seed);
    current = MG.createGame({
      boardEl,
      obstacleEl,
      level,
      rand,
      hooks: {
        onState: (state) => {
          MG.hud.render(state);
          send({ type: 'progress', matched: state.matched, flips: state.flips, pairs: state.pairs });
        },
        onEnd: (result) => {
          myResult = result;
          send({ type: 'result', result });
          MG.hud.overlay(result.cleared ? '완료! 상대 기다리는 중…' : '시간 종료… 상대 기다리는 중…');
          maybeShowWinner();
        }
      }
    });

    countdown(MG.config.countdown, () => {
      MG.hud.hideOverlay();
      current.start();
    });
  }

  function countdown(n, done) {
    if (n <= 0) {
      MG.hud.overlay('시작!');
      setTimeout(done, 500);
      return;
    }
    MG.hud.overlay(String(n));
    setTimeout(() => countdown(n - 1, done), 800);
  }

  function decideWinner(mine, rival) {
    if (mine.cleared && !rival.cleared) return 'win';
    if (!mine.cleared && rival.cleared) return 'lose';
    if (mine.cleared && rival.cleared) {
      if (mine.time < rival.time) return 'win';
      if (mine.time > rival.time) return 'lose';
      return 'draw';
    }
    // 둘 다 못 깼으면 더 많이 맞춘 쪽이 승리
    if (mine.matched > rival.matched) return 'win';
    if (mine.matched < rival.matched) return 'lose';
    return 'draw';
  }

  function maybeShowWinner() {
    if (!myResult || !rivalResult) return;

    const verdict = decideWinner(myResult, rivalResult);
    const title = { win: '승리!', lose: '패배', draw: '무승부' }[verdict];

    MG.hud.hideOverlay();
    MG.$('#vs-title').textContent = title;
    MG.$('#vs-title').className = 'big ' + (verdict === 'win' ? 'success' : verdict === 'lose' ? 'fail' : '');
    MG.$('#vs-detail').innerHTML = [
      `<p>나 — ${myResult.matched}/${myResult.pairs}쌍 · ${myResult.time}초 · ${myResult.flips}회 · ${MG.gradeLabel(myResult.grade)}</p>`,
      `<p>상대 — ${rivalResult.matched}/${rivalResult.pairs}쌍 · ${rivalResult.time}초 · ${rivalResult.flips}회 · ${MG.gradeLabel(rivalResult.grade)}</p>`
    ].join('');
    MG.showScreen('versus-result');
  }

  MG.bridge.on((message) => {
    if (!message || message.from === myPlayer) return;   // 내가 보낸 건 무시

    if (message.type === 'hello') {
      rivalMet = true;
      send({ type: 'hello-back' });
      if (!roundStarted) hostStart();
      return;
    }

    if (message.type === 'hello-back') {
      rivalMet = true;
      if (!roundStarted) hostStart();
      return;
    }

    if (message.type === 'start') {
      beginRound(message.seed);
      return;
    }

    if (message.type === 'restart') {
      hostStart();
      return;
    }

    if (message.type === 'progress') {
      MG.hud.renderRival(message);
      return;
    }

    if (message.type === 'result') {
      rivalResult = message.result;
      // 상대가 먼저 다 맞췄으면 내 판도 바로 종료
      if (message.result.cleared && current && !myResult) {
        current.forceEnd();
        return;
      }
      maybeShowWinner();
    }
  });

  MG.$('#btn-vs-retry').addEventListener('click', () => {
    if (myPlayer === 1) hostStart();
    else send({ type: 'restart' });   // 2번 창이 눌러도 1번 창이 새 판을 만들어 줌
  });

  MG.$('#btn-vs-quit').addEventListener('click', () => {
    if (current) current.stop();
    MG.bridge.quitVersus();
  });

  // 창이 열리면 상대에게 인사 (상대가 늦게 열려도 상대 인사를 받으면 시작됨)
  send({ type: 'hello' });
  setTimeout(() => {
    if (!rivalMet) send({ type: 'hello' });
  }, 700);
};
