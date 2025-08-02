// src/renderer/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useErtsvApi } from '../ertsv/react';
import './index.css';

function App() {
  // Используем элегантный хук, чтобы получить доступ к нашему API
  const api = useErtsvApi();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Кастомная шапка окна, которую можно перетаскивать */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: '#333',
          WebkitAppRegion: 'drag', // Свойство для перетаскивания
        }}
      >
        <span>ertsv App</span>
        {/* Контейнер для кнопок, который не перетаскивается */}
        <div style={{ display: 'flex', gap: '8px', WebkitAppRegion: 'no-drag' }}>
          <button onClick={() => api.window.minimize()}>_</button>
          <button onClick={() => api.window.toggleMaximize()}>[]</button>
          <button onClick={() => api.window.close()}>X</button>
        </div>
      </div>

      {/* Основной контент приложения */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <h1>Hello from ertsv! It works!</h1>
        <p>Кнопки в шапке теперь управляют нативным окном!</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);