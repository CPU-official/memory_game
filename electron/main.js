// Electron 메인 프로세스
// 하는 일 2개
//  1) 혼자하기 창 1개 띄우기
//  2) "경쟁하기" 누르면 한 화면에 창 2개를 좌우로 띄우고, 두 창끼리 메시지 전달해주기

const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

const INDEX = path.join(__dirname, "..", "index.html");
const PRELOAD = path.join(__dirname, "preload.js");

let menuWin = null;
let versusWins = [];
let closingVersus = false;

function baseOptions() {
  return {
    backgroundColor: "#0d1117",
    autoHideMenuBar: true,
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
    },
  };
}

function createMenuWindow() {
  menuWin = new BrowserWindow({
    ...baseOptions(),
    width: 1100,
    height: 780,
    minWidth: 820,
    minHeight: 640,
    title: "메모리 게임",
  });
  menuWin.loadFile(INDEX, { query: { mode: "solo" } });
  menuWin.on("closed", () => {
    menuWin = null;
  });
}

function openVersusWindows() {
  if (versusWins.length) return;

  const { width, height, x, y } = screen.getPrimaryDisplay().workArea;
  const half = Math.floor(width / 2);

  versusWins = [1, 2].map((player) => {
    const win = new BrowserWindow({
      ...baseOptions(),
      width: half,
      height: height,
      x: x + (player === 1 ? 0 : half),
      y: y,
      resizable: true,
      title: `메모리 게임 - ${player}번 플레이어`,
    });
    win.loadFile(INDEX, { query: { mode: "versus", player: String(player) } });
    win.on("closed", () => {
      // 한 창을 닫으면 경쟁 모드를 전부 종료하고 메뉴로 돌아감
      if (closingVersus) return;
      closeVersusWindows();
    });
    return win;
  });

  if (menuWin) menuWin.hide();
}

function closeVersusWindows() {
  closingVersus = true;
  versusWins.forEach((w) => {
    if (!w.isDestroyed()) w.close();
  });
  versusWins = [];
  closingVersus = false;

  if (menuWin) {
    menuWin.show();
    menuWin.focus();
  } else {
    createMenuWindow();
  }
}

ipcMain.on("versus:open", openVersusWindows);
ipcMain.on("versus:quit", closeVersusWindows);

// 한 창에서 보낸 메시지를 경쟁 중인 모든 창에 그대로 뿌려줌
ipcMain.on("versus:broadcast", (_event, message) => {
  versusWins.forEach((w) => {
    if (!w.isDestroyed()) w.webContents.send("versus:message", message);
  });
});

app.whenReady().then(() => {
  createMenuWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMenuWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
