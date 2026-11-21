// 시작 지점 : 주소의 ?mode= 값을 보고 혼자하기 / 경쟁하기로 갈라짐
(function () {
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode') === 'versus' ? 'versus' : 'solo';
  const player = Number(params.get('player') || 1);

  document.body.dataset.mode = mode;

  if (mode === 'versus') {
    MG.startVersus(player === 2 ? 2 : 1);
  } else {
    MG.startSolo();
  }
})();
