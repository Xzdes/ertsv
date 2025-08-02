// src/preload/index.ts
// ★★★ ГЛАВНОЕ ИЗМЕНЕНИЕ: Путь теперь правильный ★★★
// Из dist/preload/index.js мы идем наверх (в dist),
// затем в ertsv, и затем в preload.
import { exposeApi } from '../ertsv/preload/index';

// Просто вызываем функцию ядра, передавая ей список разрешенных модулей
exposeApi(['window']);