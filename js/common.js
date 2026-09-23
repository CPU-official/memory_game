/* =========================================================
   common.js — 모든 페이지가 공통으로 쓰는 것
   페이지가 바뀌면 JS 변수는 전부 사라지기 때문에,
   레벨별 기록은 sessionStorage(브라우저가 탭 단위로 기억해주는 저장소)에 넣어서 넘긴다.
   ========================================================= */

// 레벨 설정 — 카드 수, 제한시간, 최대 시도 횟수
const LEVELS = {
  1: { pairs: 6, cols: 4, time: 40, maxTries: 16 },
  2: { pairs: 12, cols: 6, time: 90, maxTries: 35 },
};

// 등급표 — 위에서부터 차례로 검사해서 처음 걸리는 등급을 준다
const GRADES = {
  1: [
    { grade: "perfect", time: 20, tries: 8 },
    { grade: "good", time: 30, tries: 12 },
    { grade: "normal", time: 40, tries: 16 },
  ],
  2: [
    { grade: "perfect", time: 60, tries: 18 },
    { grade: "good", time: 75, tries: 25 },
    { grade: "normal", time: 90, tries: 35 },
  ],
};

function cardShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1)); // 0부터 i까지의 정수

    [arr[i], arr[rand]] = [arr[rand], arr[i]]; // 요소를 교환
  }
  return arr; // 섞인 배열 반환
}

function checkGrade(level, time, count) {
  for (const row of GRADES[level]) {
    if (time <= row.time && count <= row.tries) return row.grade;
  }
  return "fail";
}

/* ---- 페이지 사이로 기록 넘기기 ---- */

function loadResults() {
  return JSON.parse(sessionStorage.getItem("results") || "{}"); //객체
}

function saveResult(level, data) {
  const results = loadResults();
  results[level] = data;
  sessionStorage.setItem("results", JSON.stringify(results)); //문자열
}

// 다시하기는 무조건 레벨1부터, 모든 기록 초기화
function restart() {
  sessionStorage.clear();
  location.href = "level1.html";
}
