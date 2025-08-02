import { ipcMain } from 'electron';
import type { BrowserWindow, IpcMainInvokeEvent } from 'electron';

export function bindApi(win: BrowserWindow, api: any): void {
  for (const namespace of Object.keys(api)) {
    for (const methodName of Object.keys(api[namespace])) {
      const channel = `${namespace}:${methodName}`;
      ipcMain.handle(channel, (event: IpcMainInvokeEvent, ...args: any[]) => {
        if (event.sender === win.webContents) {
          return api[namespace][methodName](win, ...args);
        }
      });
    }
  }
}