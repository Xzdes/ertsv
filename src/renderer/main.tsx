// src/renderer/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Получаем доступ к API, которое мы создали в preload
const api = window.ertsvApi;

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: '#333',
          // @ts-ignore - УДАЛИТЕ ЭТУ СТРОКУ
          '-webkit-app-region': 'drag',
        }}
      >
        <span>ertsv App</span>
        <div style={{ display: 'flex', gap: '8px', /* @ts-ignore */ '-webkit-app-region': 'no-drag' /* И ЭТУ ТОЖЕ */ }}>
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