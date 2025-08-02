// src/ertsv/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

console.log('>>> [CORE-PRELOAD] L0: Файл загружен.');

// ИСПРАВЛЕНО: Добавляем тип для аргумента
export function exposeApi(allowedNamespaces: string[]): void {
  console.log('>>> [CORE-PRELOAD] L1: Вызвана функция exposeApi.');
  const safeApi: { [key: string]: any } = {};
  for (const namespace of allowedNamespaces) {
    console.log(`>>> [CORE-PRELOAD] L2: Создаем прокси для пространства имен: ${namespace}`);
    safeApi[namespace] = new Proxy({}, {
      get(_target, prop: string | symbol) {
        // ИСПРАВЛЕНО: Проверяем, что prop не является символом, чтобы избежать ошибок
        if (typeof prop === 'symbol') return undefined;

        return (...args: any[]) => {
          const channel = `${namespace}:${String(prop)}`;
          console.log(`>>> [CORE-PRELOAD] L3: Вызов API через прокси. Канал: ${channel}, Аргументы:`, args);
          return ipcRenderer.invoke(channel, ...args);
        }
      }
    });
  }
  console.log('>>> [CORE-PRELOAD] L4: Вызываем contextBridge.exposeInMainWorld для ertsvApi.');
  contextBridge.exposeInMainWorld('ertsvApi', safeApi);
}