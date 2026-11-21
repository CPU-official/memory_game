// ─────────────────────────────────────────────────────────────
//  등급 계산   ★ 1학년이 자바로 만들어 온 로직이 들어갈 자리
// ─────────────────────────────────────────────────────────────
// 자바 버전:  String checkGrade(int level, int time, int count)
//
// 기준 숫자는 config.js 의 levels[].grades 에 들어있음.
// 위에서부터 차례로 검사하고, 시간과 횟수를 "둘 다" 만족해야 그 등급이 됨.
// 하나도 안 걸리면 'fail'
window.MG = window.MG || {};

MG.checkGrade = function (level, time, flips) {
  const conf = MG.getLevel(level);

  for (const g of conf.grades) {
    if (time <= g.time && flips <= g.flips) {
      return g.name;
    }
  }

  return 'fail';
};
