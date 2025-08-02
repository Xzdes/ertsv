import type { BrowserWindow } from 'electron';

export const windowApi = {
  minimize(win: BrowserWindow): void {
    win.minimize();
  },
  toggleMaximize(win: BrowserWindow): void {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },
  close(win: BrowserWindow): void {
    win.close();
  },
};