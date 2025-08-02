// src/renderer/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const api = window.ertsvApi;

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Кастомная шапка окна */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: '#333',
          // ★★★ ИСПРАВЛЕНИЕ: Используем camelCase, как просит React ★★★
          WebkitAppRegion: 'drag',
        }}
      >
        <span>ertsv App</span>
        <div style={{ display: 'flex', gap: '8px', WebkitAppRegion: 'no-drag' }}>
          <button onClick={() => api.window.minimize()}>_</button>
          <button onClick={() => api.window.toggleMaximize()}>[]</button>
          <button onClick={() => api.window.close()}>X</button>
        </div>
      </div>

      {/* Основной контент */}
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