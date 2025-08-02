// src/modules/window/api.ts
import { BrowserWindow } from 'electron';

// Все функции API должны принимать первым аргументом окно,
// чтобы знать, к какому окну применять действие.
export const windowApi = {
  minimize(win: BrowserWindow) {
    win.minimize();
  },
  toggleMaximize(win: BrowserWindow) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },
  close(win: BrowserWindow) {
    win.close();
  },
};