// src/ertsv/main/index.ts
import { BrowserWindow, ipcMain } from 'electron';

// Тип для любого объекта API
type ApiModule = { [key: string]: (...args: any[]) => any };

export function bindApi<T extends { [key: string]: ApiModule }>(win: BrowserWindow, api: T) {
  for (const namespace of Object.keys(api) as Array<keyof T>) {
    for (const methodName of Object.keys(api[namespace]) as Array<keyof T[typeof namespace]>) {
      const channel = `${String(namespace)}:${String(methodName)}`;
      
      ipcMain.handle(channel, (event, ...args) => {
        if (event.sender === win.webContents) {
          const method = api[namespace][methodName] as Function;
          return method(win, ...args); // Передаем win первым аргументом неявно
        }
      });
    }
  }
  
  // Очистка при закрытии окна
  win.on('closed', () => {
    for (const namespace of Object.keys(api) as Array<keyof T>) {
      for (const methodName of Object.keys(api[namespace])) {
        ipcMain.removeHandler(`${String(namespace)}:${String(methodName)}`);
      }
    }
  });
}