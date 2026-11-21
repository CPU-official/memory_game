// 게임 화면(렌더러)에서 쓸 수 있는 통로만 최소한으로 열어줌
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronBridge', {
  isElectron: true,

  // 경쟁 모드: 다른 창에 메시지 보내기
  send: (message) => ipcRenderer.send('versus:broadcast', message),

  // 경쟁 모드: 다른 창이 보낸 메시지 받기
  on: (handler) => ipcRenderer.on('versus:message', (_event, message) => handler(message)),

  // 창 2개 띄우기 / 경쟁 모드 종료
  openVersus: () => ipcRenderer.send('versus:open'),
  quitVersus: () => ipcRenderer.send('versus:quit')
});
