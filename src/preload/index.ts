// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

// Мы создаем API, которое будет доступно в React как window.ertsvApi
const api = {
  // Пространство имен 'window'
  window: {
    // Функция minimize теперь просто отправляет сообщение
    minimize: () => ipcRenderer.invoke('window:minimize'),
    // Функция toggleMaximize просто отправляет сообщение
    toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
    // Функция close просто отправляет сообщение
    close: () => ipcRenderer.invoke('window:close'),
  },

  // В будущем мы можем добавить другие модули здесь
  // fs: {
  //   readFile: (path) => ipcRenderer.invoke('fs:readFile', path),
  // }
};

// Выставляем наш простой объект API в мир рендерера.
// Этот объект Electron может безопасно клонировать.
contextBridge.exposeInMainWorld('ertsvApi', api);


// Добавим типы для TypeScript
declare global {
  interface Window {
    ertsvApi: typeof api;
  }
}