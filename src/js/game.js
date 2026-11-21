// 한 판(레벨 1판) 진행하는 공통 로직
// 혼자하기(solo.js)와 경쟁하기(versus.js)가 둘 다 이 파일을 쓴다.
window.MG = window.MG || {};

MG.createGame = function ({ boardEl, obstacleEl, level, rand, hooks = {} }) {
  const conf = MG.getLevel(level);
  const board = MG.createBoard({ root: boardEl, pairs: conf.pairs, cols: conf.cols, rand });

  let firstCard = null;
  let locked = false;
  let flips = 0;        // 두 장 뒤집은 "횟수"
  let matched = 0;      // 맞춘 쌍 개수
  let finished = false;
  let elapsed = 0;
  let timer = null;
  let obstacles = null;

  function report() {
    if (hooks.onState) {
      hooks.onState({
        flips,
        matched,
        pairs: conf.pairs,
        remain: Math.max(0, conf.timeLimit - elapsed),
        timeLimit: conf.timeLimit,
        maxFlips: conf.maxFlips
      });
    }
  }

  function finish(cleared) {
    if (finished) return;
    finished = true;
    locked = true;
    if (timer) timer.stop();
    if (obstacles) obstacles.stop();

    const result = {
      level: conf.level,
      cleared,
      time: elapsed,
      flips,
      matched,
      pairs: conf.pairs,
      grade: cleared ? MG.checkGrade(conf.level, elapsed, flips) : 'fail'
    };

    if (hooks.onEnd) hooks.onEnd(result);
  }

  function handleClick(card) {
    if (locked || finished) return;
    if (card.classList.contains('matched')) return;   // 이미 맞춘 카드는 못 누름
    if (card.classList.contains('flipped')) return;   // 같은 카드 두 번 못 누름

    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    const secondCard = card;
    flips += 1;

    if (firstCard.dataset.value === secondCard.dataset.value) {
      // 짝이 맞음
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      firstCard = null;
      matched += 1;
      report();

      if (matched === conf.pairs) {
        finish(true);
        return;
      }
    } else {
      // 짝이 틀림 - 잠깐 보여주고 다시 덮기 (그 동안 다른 카드 못 누르게 잠금)
      locked = true;
      const a = firstCard;
      const b = secondCard;
      firstCard = null;
      report();

      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        locked = false;
      }, MG.config.flipBackDelay);
    }

    // 횟수 초과하면 실패
    if (flips > conf.maxFlips) finish(false);
  }

  board.cards.forEach((card) => {
    card.addEventListener('click', () => handleClick(card));
  });

  return {
    level: conf.level,

    start() {
      elapsed = 0;
      report();

      timer = MG.createTimer((sec) => {
        elapsed = sec;
        report();
        if (elapsed >= conf.timeLimit) finish(false);
      });
      timer.start();

      obstacles = MG.startObstacles({
        layer: obstacleEl,
        schedule: conf.obstacles,
        rand
      });
    },

    // 상대가 먼저 다 맞췄을 때 등 바깥에서 강제로 끝낼 때 사용
    forceEnd() {
      finish(false);
    },

    stop() {
      finished = true;
      if (timer) timer.stop();
      if (obstacles) obstacles.stop();
    }
  };
};
