
### **Концепт Ядра `ertsv`**

#### **Философия**

Ядро `ertsv` — это невидимый, но надежный слуга. Его единственная задача — создать **бесшовный, типобезопасный мост** между миром Node.js (Main-процесс) и миром React (Renderer-процесс).

**Ядро должно обладать тремя качествами:**
1.  **Прозрачность:** Разработчик всегда понимает, как данные передаются от точки А к точке Б. Никакой магии.
2.  **Надежность:** Сборочные скрипты и сам мост работают предсказуемо и не падают.
3.  **Минимализм:** Ядро не лезет в бизнес-логику. Оно предоставляет только инструменты для связи.

#### **Архитектура: "Единственный Источник Истины"**

В отличие от AxleLLM, у нас не будет манифестов. **Единственный источник истины — это ваш код.** Вся архитектура строится вокруг файлов, которые вы пишете в папке `src/modules`.

#### **Структура Файлов Ядра и Приложения**

```
S:\ertsv/
├── dist/                   # (Генерируется)
├── src/
│   ├── main/
│   │   └── index.ts        # (Приложение) Точка входа Main. Максимально простая.
│   ├── preload/
│   │   └── index.ts        # (Приложение) Точка входа Preload. Максимально простая.
│   ├── renderer/
│   │   ├── main.tsx        # (Приложение) Точка входа React.
│   │   └── vite-env.d.ts   # (Приложение) Глобальные типы для фронтенда.
│   ├── modules/
│   │   └── window/
│   │       └── api.ts      # (Приложение) Бизнес-логика бэкенда.
│   └── ertsv/              # ★★★ НАШЕ ЯДРО ★★★
│       ├── main/
│       │   └── index.ts    # (Ядро) Логика для Main-процесса (bindApi).
│       └── preload/
│           └── index.ts    # (Ядро) Логика для Preload-процесса (exposeApi).
│
├── package.json
└── tsconfig.json           # ★★★ КЛЮЧЕВОЙ ФАЙЛ КОНФИГУРАЦИИ ★★★
```

#### **Как работает Мост (По шагам):**

1.  **Разработчик пишет API** в `src/modules/window/api.ts`. Это обычный JS-объект с функциями.
2.  **Разработчик "собирает" API** в `src/main/index.ts`, импортируя все модули и создавая `rootApi`.
3.  **`tsc` (Компилятор TypeScript)** запускается. Согласно **правильному `tsconfig.json`**, он читает **все** нужные бэкенд-файлы (`main`, `preload`, `ertsv/main`, `ertsv/preload`) и компилирует их в папку `dist`, **сохраняя структуру папок**.
4.  **Electron запускается** и загружает `dist/main/index.js`.
5.  **`main/index.js`** импортирует `bindApi` из `dist/ertsv/main/index.js` и регистрирует обработчики (`ipcMain.handle`).
6.  **Electron загружает `preload` скрипт** `dist/preload/index.js`.
7.  **`preload/index.js`** импортирует `exposeApi` из `dist/ertsv/preload/index.js` и создает мост (`contextBridge`).
8.  **React-приложение (`main.tsx`)** получает доступ к `window.ertsvApi` и может вызывать его функции.

Проблема, с которой мы столкнулись, была в **Шаге 3**. Наш `tsconfig.json` был настроен неверно и не создавал правильную структуру файлов в `dist`, из-за чего на Шаге 7 `preload` не мог найти свое ядро.

---

### **Реализация Концепта: Финальная, Рабочая Конфигурация**

Давайте реализуем этот концепт. Это финальная попытка, основанная на полном понимании проблемы.

#### **1. Финальный, Единственно Правильный `tsconfig.json`**

**Это самый важный файл. Он решает все проблемы со сборкой.**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022", "DOM"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": [
    "src/main",
    "src/preload",
    "src/ertsv/main",
    "src/ertsv/preload"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

**Почему он работает:**
*   **`"rootDir": "src"`**: Сохраняет структуру папок (`main`, `preload`, `ertsv`) внутри `dist`.
*   **`"include": ["src/main", ...]`**: Явно указывает, какие папки компилировать. Больше никаких `**/*.ts` или `baseUrl`. Просто и надежно. Он **не трогает** `src/renderer` и `src/ertsv/react`.

#### **2. Финальный `package.json`**

Скрипты остаются такими же надежными.

```json
{
  "name": "ertsv-app",
  "version": "0.1.0",
  "private": true,
  "main": "dist/main/index.js",
  "scripts": {
    "dev": "npm run build:main && concurrently -k --kill-others-on-fail \"npm:watch:main\" \"npm:dev:vite\" \"npm:dev:electron\"",
    "build": "npm run build:main && npm run build:renderer",
    "build:main": "tsc",
    "build:renderer": "vite build",
    "watch:main": "tsc --watch",
    "dev:vite": "vite",
    "dev:electron": "nodemon --exitcrash",
    "package": "npm run build && electron-builder"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "concurrently": "^8.2.2",
    "electron": "^31.0.0",
    "electron-builder": "^24.13.3",
    "nodemon": "^3.1.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.13"
  },
  "build": {
    "appId": "com.ertsv.app",
    "productName": "ertsv App",
    "directories": { "output": "release" },
    "files": ["dist/", "package.json"]
  }
}
```

#### **3. Финальные `main/index.ts` и `preload/index.ts`**

Они остаются такими же простыми, с относительными путями.

*   **`src/main/index.ts`:**
    ```typescript
    import { app, BrowserWindow } from 'electron';
    import path from 'path';
    import { bindApi } from '../ertsv/main';
    import { windowApi } from '../modules/window/api';

    // ... остальной код без изменений
    ```

*   **`src/preload/index.ts`:**
    ```typescript
    import { exposeApi } from '../ertsv/preload';

    exposeApi(['window']);
    ```

### **Финальный План Действий**

1.  Остановите все процессы (`Ctrl+C`).
2.  **Замените** содержимое `tsconfig.json` и `package.json` на код выше.
3.  **Убедитесь**, что импорты в `src/main/index.ts` и `src/preload/index.ts` относительные (`../ertsv/...`).
4.  **УДАЛИТЕ** папку `dist`.
5.  Выполните `npm install`, чтобы убедиться, что все зависимости соответствуют `package.json`.
6.  Запустите `npm run dev`.