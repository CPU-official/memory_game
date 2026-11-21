// 게임 화면 위쪽 정보창(남은 시간 / 뒤집은 횟수 / 맞춘 쌍) 그리기
window.MG = window.MG || {};

MG.hud = {
  setLevel(text) {
    MG.$('#hud-level').textContent = text;
  },

  render(state) {
    MG.$('#hud-time').textContent = MG.formatTime(state.remain);
    MG.$('#hud-flips').textContent = state.flips + ' / ' + state.maxFlips;
    MG.$('#hud-pairs').textContent = state.matched + ' / ' + state.pairs;

    // 남은 시간이 10초 이하면 빨갛게
    MG.$('#hud-time').classList.toggle('danger', state.remain <= 10);
  },

  renderRival(state) {
    const box = MG.$('#rival');
    if (!state) {
      box.textContent = '상대 준비 중…';
      return;
    }
    box.textContent = `상대 ${state.matched} / ${state.pairs}쌍 · ${state.flips}회`;
  },

  // 화면 중앙에 큰 글자 띄우기 (카운트다운, "레벨 1 통과!" 등)
  overlay(text) {
    const el = MG.$('#overlay');
    el.textContent = text;
    el.classList.add('show');
  },

  hideOverlay() {
    MG.$('#overlay').classList.remove('show');
  }
};
