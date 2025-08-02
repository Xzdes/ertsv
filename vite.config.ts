// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // ★★★ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: УКАЗЫВАЕМ КОРЕНЬ ПРОЕКТА ★★★
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    // Указываем, куда Vite должен собирать продакшн-сборку
    outDir: path.resolve(__dirname, 'dist/renderer'),
  }
});