// src/modules/window/api.ts
// ИСПРАВЛЕНО: Используем 'import type', чтобы не было конфликта 'Cannot redeclare'
import type { BrowserWindow } from 'electron';

console.log('>>> [API-WINDOW] L0: Файл загружен.');

export const windowApi = {
  minimize(win: BrowserWindow): void {
    console.log('>>> [API-WINDOW] Вызван minimize.');
    win.minimize();
  },
  toggleMaximize(win: BrowserWindow): void {
    console.log('>>> [API-WINDOW] Вызван toggleMaximize.');
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },
  close(win: BrowserWindow): void {
    console.log('>>> [API-WINDOW] Вызван close.');
    win.close();
  },
};