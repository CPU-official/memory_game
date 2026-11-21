// 화면 전환 / 자주 쓰는 짧은 함수들
window.MG = window.MG || {};

MG.$ = (selector) => document.querySelector(selector);

MG.showScreen = function (name) {
  document.querySelectorAll('[data-screen]').forEach((el) => {
    el.classList.toggle('active', el.dataset.screen === name);
  });
};

// 12 -> "00:12"
MG.formatTime = function (seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return m + ':' + s;
};
