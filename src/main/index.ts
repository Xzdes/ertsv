// src/main/index.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { bindApi } from '../ertsv/main';
import { windowApi } from '../modules/window/api';

const isDev = process.env.NODE_ENV === 'development';

// Собираем корневой API из всех наших модулей
const rootApi = {
  window: windowApi,
  // В будущем здесь можно будет добавлять другие модули
  // fs: fsApi,
};

// Экспортируем тип нашего API, чтобы кодогенератор мог его использовать
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

  // Вся сложность регистрации IPC-обработчиков спрятана в ядре
  bindApi(mainWindow, rootApi);

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
  // Нам не нужно вручную удалять обработчики здесь,
  // так как функция bindApi теперь сама заботится об этом при закрытии окна.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});