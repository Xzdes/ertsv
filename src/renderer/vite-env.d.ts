/// <reference types="vite/client" />

// --- НАЧАЛО: РАСШИРЕНИЕ ТИПОВ REACT ДЛЯ CSS ---
import 'react';

declare module 'react' {
  interface CSSProperties {
    '-webkit-app-region'?: 'drag' | 'no-drag';
  }
}
// --- КОНЕЦ: РАСШИРЕНИЕ ТИПОВ REACT ДЛЯ CSS ---


// Объявляем тип нашего API
export interface IErtsvApi {
  window: {
    minimize: () => void;
    toggleMaximize: () => void;
    close: () => void;
  };
}

// Расширяем глобальный объект Window
declare global {
  interface Window {
    ertsvApi: IErtsvApi;
  }
}