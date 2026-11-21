// 씨앗(seed)으로 랜덤을 만드는 함수
// 경쟁 모드에서 두 창이 "똑같은 카드 배치 / 똑같은 장애물"을 받아야 공평하니까,
// 같은 씨앗을 주면 항상 같은 랜덤 순서가 나오게 만든 것.
// 혼자하기에서는 그냥 Math.random을 쓰면 됨.
window.MG = window.MG || {};

MG.createRandom = function (seed) {
  let state = seed >>> 0;
  return function () {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

MG.makeSeed = function () {
  return Math.floor(Math.random() * 2147483647);
};
