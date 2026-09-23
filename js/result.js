/* =========================================================
   result.js — 성공 / 실패 화면에서 결과를 보여주는 부분
   common.js 를 먼저 불러와야 동작함
   ========================================================= */

function renderSuccess() {
  const results = loadResults();
  const box = document.getElementById("result");

  [1, 2].forEach((n) => {
    const r = results[n];
    if (!r) return;
    const p = document.createElement("p");
    p.className = "result-line";
    p.textContent = `레벨${n} — ${r.time}초 / ${r.tries}회 → ${r.grade.toUpperCase()}`;
    box.appendChild(p);
  });
}

function renderFail() {
  document.getElementById("fail-reason").textContent =
    sessionStorage.getItem("failReason") || "";
}
