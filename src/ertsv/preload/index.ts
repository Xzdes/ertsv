// src/ertsv/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

export function exposeApi(allowedNamespaces: string[]) {
  const safeApi: { [key: string]: any } = {};

  for (const namespace of allowedNamespaces) {
    safeApi[namespace] = new Proxy({}, {
      get(_target, prop: string) {
        return (...args: any[]) => ipcRenderer.invoke(`${namespace}:${prop}`, ...args);
      }
    });
  }
  
  contextBridge.exposeInMainWorld('ertsvApi', safeApi);
}