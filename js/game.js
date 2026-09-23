/* =========================================================
   game.js — 카드 짝맞추기 게임 로직 (level1.html, level2.html 공용)
   common.js 를 먼저 불러와야 동작함
   ========================================================= */

const FLIP_BACK_DELAY = 1000; // 안 맞았을 때 다시 덮기까지 기다리는 시간(ms)

// ---- 게임 상태 ----
let level = 1;
let flipped = []; // 지금 뒤집어놓은 카드 (최대 2장)
let lock = false; // true면 클릭 무시 (비교 중 세 번째 카드 막기)
let matched = 0; // 맞춘 쌍 개수
let tries = 0; // 시도 횟수 (2장 뒤집으면 1회)
let timeLeft = 0;
let timerId = null; // setInterval 번호. 끌 때 필요함

/* ---------------------------------------------------------
   레벨 시작 — 각 페이지 맨 아래에서 startLevel(1) 또는 startLevel(2) 호출
   --------------------------------------------------------- */
function startLevel(n) {
  level = n;
  const cfg = LEVELS[n];

  flipped = [];
  lock = false;
  matched = 0;
  tries = 0;
  timeLeft = cfg.time;

  buildBoard(cfg);
  updateHud();

  clearInterval(timerId); // 혹시 남아있는 타이머가 있으면 끄고 시작
  timerId = setInterval(tick, 1000);
}

function buildBoard(cfg) {
  // [1,1,2,2,3,3...] 짝 배열 만들고 섞기
  const values = [];
  for (let i = 1; i <= cfg.pairs; i++) {
    values.push(i, i);
  }
  cardShuffle(values);

  const board = document.getElementById("board");
  board.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`; //fraction : 비율이라는 뜻
  board.innerHTML = "";

  values.forEach((v) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.value = v; // ★ 짝 비교는 이 값으로만 한다
    card.innerHTML = `
      <div class="card-inner">
        <div class="face back">?</div>
        <div class="face front"><img src="images/${v}.png" alt="${v}"></div>
      </div>`;
    card.addEventListener("click", () => onCardClick(card));
    board.appendChild(card);
  });
}

/* ---------------------------------------------------------
   카드 클릭 — 게임의 핵심
   --------------------------------------------------------- */
function onCardClick(card) {
  // 무시해야 하는 경우 3가지를 먼저 걸러낸다
  if (lock) return; // 비교하는 중
  if (card.classList.contains("matched")) return; // 이미 맞춘 카드
  if (card.classList.contains("flipped")) return; // 방금 뒤집은 카드를 또 누름

  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length < 2) return; // 아직 한 장뿐이면 여기서 끝

  // --- 여기부터는 2장이 다 뒤집힌 상태 ---
  tries++;
  updateHud();

  const [a, b] = flipped;

  if (a.dataset.value === b.dataset.value) {
    // 맞음: 그대로 두고 맞춤 표시
    a.classList.add("matched");
    b.classList.add("matched");
    flipped = [];
    matched++;

    if (matched === LEVELS[level].pairs) {
      levelClear();
      return;
    }
  } else {
    // 틀림: 잠깐 막아놓고 다시 덮기
    lock = true;
    setTimeout(() => {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      flipped = [];
      lock = false;
    }, FLIP_BACK_DELAY);
  }

  // 횟수를 다 쓰면 실패
  if (matched < LEVELS[level].pairs && tries >= LEVELS[level].maxTries) {
    gameOver("횟수를 다 썼어요");
  }
}

/* ---------------------------------------------------------
   타이머
   --------------------------------------------------------- */
function tick() {
  timeLeft--;
  updateHud();
  if (timeLeft <= 0) {
    gameOver("시간이 다 됐어요");
  }
}

function updateHud() {
  document.getElementById("hud-level").textContent = level;
  document.getElementById("hud-time").textContent = Math.max(timeLeft, 0);
  document.getElementById("hud-tries").textContent = tries;
}

/* ---------------------------------------------------------
   클리어 / 실패 — 결과를 저장하고 다음 페이지로 이동
   --------------------------------------------------------- */
function levelClear() {
  clearInterval(timerId); // ★ 반드시 꺼야 함

  const usedTime = LEVELS[level].time - timeLeft;
  saveResult(level, {
    time: usedTime,
    tries: tries,
    grade: checkGrade(level, usedTime, tries),
  });

  const next = level === 1 ? "level2.html" : "success.html";
  setTimeout(() => (location.href = next), 600); // 마지막 카드 보여주고 이동
}

function gameOver(reason) {
  clearInterval(timerId);
  lock = true; // 이동하기 전 남은 클릭 막기
  sessionStorage.setItem("failReason", reason);
  setTimeout(() => (location.href = "fail.html"), 600);
}
