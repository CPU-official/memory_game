// 두 창끼리 메시지를 주고받는 통로
//  - Electron 으로 켰으면 preload.js 가 만들어준 통로를 그대로 씀
//  - 브라우저(Live Server)에서 켰으면 BroadcastChannel 로 대신 동작 (개발용)
window.MG = window.MG || {};

MG.bridge = (function () {
  if (window.electronBridge) return window.electronBridge;

  const channel = new BroadcastChannel('memory-game');

  return {
    isElectron: false,
    send: (message) => channel.postMessage(message),
    on: (handler) => { channel.onmessage = (event) => handler(event.data); },
    openVersus: () => {
      // 브라우저에서는 새 탭으로 2번 플레이어를 열고, 현재 탭이 1번이 됨
      window.open(location.pathname + '?mode=versus&player=2', '_blank');
      location.search = '?mode=versus&player=1';
    },
    quitVersus: () => { location.search = '?mode=solo'; }
  };
})();
