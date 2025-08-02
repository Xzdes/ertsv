// src/ertsv/main/index.ts
import { ipcMain } from 'electron';
// Используем type-only импорты, чтобы не создавать лишних переменных
import type { BrowserWindow, IpcMainInvokeEvent } from 'electron';

console.log('>>> [CORE-MAIN] L0: Файл загружен.');

// Определяем типы для нашего API, чтобы все было строго
type ApiMethod = (win: BrowserWindow, ...args: any[]) => any;
type ApiModule = { [methodName: string]: ApiMethod };
type RootApi = { [namespace: string]: ApiModule };

export function bindApi(win: BrowserWindow, api: RootApi): void {
  console.log('>>> [CORE-MAIN] L1: Вызвана функция bindApi.');
  for (const namespace of Object.keys(api)) {
    for (const methodName of Object.keys(api[namespace])) {
      const channel = `${namespace}:${methodName}`;
      console.log(`>>> [CORE-MAIN] L2: Регистрируем обработчик для канала: ${channel}`);
      
      // ИСПРАВЛЕНО: Используем правильный тип события IpcMainInvokeEvent для ipcMain.handle
      ipcMain.handle(channel, (event: IpcMainInvokeEvent, ...args: any[]) => {
        if (event.sender === win.webContents) {
          const method = api[namespace][methodName];
          return method(win, ...args);
        }
      });
    }
  }
  
  win.on('closed', () => {
    console.log('>>> [CORE-MAIN] L3: Окно закрыто. Удаляем обработчики.');
    for (const namespace of Object.keys(api)) {
      for (const methodName of Object.keys(api[namespace])) {
        ipcMain.removeHandler(`${namespace}:${methodName}`);
      }
    }
  });
}