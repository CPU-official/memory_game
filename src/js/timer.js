// 제한시간 재는 타이머 (setInterval 대신 setTimeout 을 계속 다시 걸어서 1초씩 센다)
window.MG = window.MG || {};

MG.createTimer = function (onTick) {
  let seconds = 0;
  let id = null;
  let running = false;

  function loop() {
    id = setTimeout(() => {
      if (!running) return;
      seconds += 1;
      onTick(seconds);
      if (running) loop();
    }, 1000);
  }

  return {
    start() {
      running = true;
      seconds = 0;
      loop();
    },
    stop() {
      running = false;
      clearTimeout(id);
    },
    get seconds() {
      return seconds;
    }
  };
};
