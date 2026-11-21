// ─────────────────────────────────────────────────────────────
//  카드 섞기   ★ 1학년이 자바로 만들어 온 로직이 들어갈 자리
// ─────────────────────────────────────────────────────────────
// 자바 버전:  int[] shuffle(int[] cards)
// 자바에서 쓴 Math.random() 자리를 rand() 로만 바꾸면 그대로 동작함.
//
// rand 를 안 넘기면 Math.random 을 씀 (혼자하기)
// 경쟁 모드에서는 씨앗으로 만든 랜덤 함수를 넘겨서 두 창의 배치를 똑같이 맞춤
window.MG = window.MG || {};

MG.shuffle = function (cards, rand) {
  const random = rand || Math.random;
  const a = cards.slice();          // 원본은 건드리지 않음

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));   // 0번 ~ i번 중에서만 뽑기
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  return a;
};
