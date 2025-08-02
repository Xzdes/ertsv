import { app, BrowserWindow } from 'electron';
import path from 'path';
import { bindApi } from '../ertsv/main';
import { windowApi } from '../modules/window/api';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
    },
  });

  // ★★★ ВОЗВРАЩАЕМ ПОДКЛЮЧЕНИЕ API ★★★
  bindApi(mainWindow, { window: windowApi });

  const viteUrl = 'http://localhost:5173';
  mainWindow.loadURL(viteUrl);
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});