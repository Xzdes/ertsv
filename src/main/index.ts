// src/main/index.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { windowApi } from '../modules/window/api';

const isDev = process.env.NODE_ENV === 'development';

const rootApi = {
  window: windowApi,
};

export type RootApi = typeof rootApi;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // ★★★ НАЧАЛО ФИНАЛЬНОГО ИСПРАВЛЕНИЯ ★★★
  // Мы создаем обработчики здесь, внутри createWindow,
  // чтобы у них был доступ к `mainWindow`.

  ipcMain.handle('window:minimize', () => mainWindow.minimize());
  ipcMain.handle('window:toggleMaximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.handle('window:close', () => mainWindow.close());

  // ★★★ КОНЕЦ ФИНАЛЬНОГО ИСПРАВЛЕНИЯ ★★★


  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Перед выходом приложения важно удалить все обработчики,
  // чтобы избежать утечек памяти при перезапусках.
  ipcMain.removeHandler('window:minimize');
  ipcMain.removeHandler('window:toggleMaximize');
  ipcMain.removeHandler('window:close');

  if (process.platform !== 'darwin') {
    app.quit();
  }
});