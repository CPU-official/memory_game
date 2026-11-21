// 장애물 - 화면 가리기
// 정해진 시간(config 의 obstacles)에 구름/연기 같은 덩어리가 카드판을 쓱 지나가면서 가린다.
// 클릭은 막지 않음 (CSS 에서 pointer-events: none) - 안 보여서 어려운 것뿐
window.MG = window.MG || {};

MG.startObstacles = function ({ layer, schedule, rand }) {
  const random = rand || Math.random;
  const timeouts = [];
  let stopped = false;

  function spawn(duration) {
    if (stopped) return;

    const el = document.createElement('div');
    el.className = 'obstacle ' + (random() < 0.5 ? 'from-left' : 'from-right');
    const size = 75 + Math.floor(random() * 25);          // 카드판 높이의 75~99% 를 가림
    el.style.setProperty('--size', size + '%');
    el.style.setProperty('--top', Math.floor(random() * (100 - size)) + '%');
    el.style.setProperty('--dur', duration + 's');
    layer.appendChild(el);

    timeouts.push(setTimeout(() => el.remove(), duration * 1000));
  }

  (schedule || []).forEach((item) => {
    timeouts.push(setTimeout(() => spawn(item.dur), item.at * 1000));
  });

  return {
    stop() {
      stopped = true;
      timeouts.forEach(clearTimeout);
      layer.innerHTML = '';
    }
  };
};
