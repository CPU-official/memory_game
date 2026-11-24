// ─────────────────────────────────────────────────────────────
//  게임 설정 파일  ★ 숫자나 이미지를 바꾸고 싶으면 이 파일만 고치면 됨
// ─────────────────────────────────────────────────────────────
window.MG = window.MG || {};

MG.config = {
  // ── 카드 이미지 ─────────────────────────────────────────────
  // 레포 맨 위에 있는 images/ 폴더의 이미지를 쓴다.
  // 그 파일 이름을 아래에 순서대로 적으면 됨.
  //   레벨1 = 앞에서 6개만 사용 (6쌍 = 12장)
  //   레벨2 = 12개 전부 사용   (12쌍 = 24장)
  assetBase: "images/",
  cardImages: [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.png",
    "11.png",
    "12.png",
  ],
  cardBack: "cardBack.png", // 카드 뒷면 이미지 (비워두면 CSS 기본 뒷면이 보임)

  // 짝이 안 맞았을 때 다시 덮기까지 기다리는 시간(ms)
  flipBackDelay: 700,

  // 경쟁 모드 시작 전 카운트다운(초)
  countdown: 3,

  // 경쟁 모드에서 쓸 레벨 (1 또는 2)
  versusLevel: 1,

  // ── 레벨 설정 ──────────────────────────────────────────────
  levels: [
    {
      level: 1,
      pairs: 6, // 6쌍 = 카드 12장
      cols: 4, // 4열 x 3행
      timeLimit: 60, // 제한 시간(초)
      maxFlips: 16, // 이 횟수를 넘으면 바로 실패
      grades: [
        // 위에서부터 검사, 시간과 횟수를 둘 다 만족해야 함
        { name: "perfect", time: 30, flips: 8 },
        { name: "good", time: 45, flips: 12 },
        { name: "normal", time: 60, flips: 16 },
      ],
      // 장애물(화면 가리기): at초에 나타나서 dur초 동안 카드판을 지나감
      // 더 자주 나오게 하려면 줄을 추가하고, 더 오래 가리려면 dur 을 키우면 됨
      obstacles: [
        { at: 8, dur: 5 },
        { at: 20, dur: 5 },
        { at: 32, dur: 6 },
        { at: 45, dur: 6 },
      ],
    },
    {
      level: 2,
      pairs: 12, // 12쌍 = 카드 24장
      cols: 6, // 6열 x 4행
      timeLimit: 90,
      maxFlips: 35,
      grades: [
        { name: "perfect", time: 60, flips: 18 },
        { name: "good", time: 75, flips: 25 },
        { name: "normal", time: 90, flips: 35 },
      ],
      obstacles: [
        { at: 15, dur: 5 },
        { at: 38, dur: 5 },
        { at: 58, dur: 6 },
        { at: 76, dur: 6 },
      ],
    },
  ],
};

// 레벨 번호로 설정 꺼내기
MG.getLevel = function (level) {
  return (
    MG.config.levels.find((l) => l.level === Number(level)) ||
    MG.config.levels[0]
  );
};

// 카드 값(1,2,3...)으로 이미지 경로 만들기
MG.cardImage = function (value) {
  const name = MG.config.cardImages[value - 1];
  return name ? MG.config.assetBase + name : "";
};

MG.cardBackImage = function () {
  return MG.config.cardBack ? MG.config.assetBase + MG.config.cardBack : "";
};

// 등급 이름을 화면에 보여줄 글자로
MG.gradeLabel = function (grade) {
  return (
    { perfect: "PERFECT", good: "GOOD", normal: "NORMAL", fail: "FAIL" }[
      grade
    ] || grade
  );
};
