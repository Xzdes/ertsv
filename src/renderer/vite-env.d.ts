// src/renderer/vite-env.d.ts

/// <reference types="vite/client" />

// --- РАСШИРЕНИЕ ТИПОВ REACT ДЛЯ ПОДДЕРЖКИ CSS-СВОЙСТВ ELECTRON ---
import 'react';

declare module 'react' {
  // Расширяем стандартный интерфейс CSSProperties, добавляя наше свойство
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

// --- ОБЪЯВЛЕНИЕ ГЛОБАЛЬНОГО API, КОТОРОЕ ПРИХОДИТ ИЗ PRELOAD ---

// 1. Описываем точную "форму" (интерфейс) нашего API
export interface IErtsvApi {
  window: {
    minimize: () => Promise<void>;
    toggleMaximize: () => Promise<void>;
    close: () => Promise<void>;
  };
}

// 2. Расширяем глобальный объект Window, добавляя в него наше API
declare global {
  interface Window {
    ertsvApi: IErtsvApi;
  }
}