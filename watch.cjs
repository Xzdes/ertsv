// watch.cjs (FINAL LOGGING VERSION)
const esbuild = require('esbuild');
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

console.log('[WATCH] L0: Скрипт запущен.');
console.log(`[WATCH] L1: Определен __dirname: ${__dirname}`);

let electronProcess;
let isFirstRun = true;

const startElectron = () => {
    console.log('[WATCH] L10: Вызов startElectron.');
    if (electronProcess) {
        console.log(`[WATCH] L11: Убиваем старый процесс (PID: ${electronProcess.pid}).`);
        electronProcess.kill();
    }
    const env = { ...process.env, NODE_ENV: 'development' };
    const entryPoint = path.join(__dirname, 'dist', 'main.js');

    console.log(`[WATCH] L12: Запускаем Electron с точкой входа: ${entryPoint}`);
    electronProcess = spawn(electron, [entryPoint], { stdio: 'inherit', env });
    
    console.log(`[WATCH] L13: spawn вызван. PID нового процесса: ${electronProcess.pid}`);
    electronProcess.on('close', (code) => {
        console.error(`[WATCH-ELECTRON] FATAL: Процесс Electron завершился с кодом: ${code}`);
    });
};

async function watch() {
    console.log('[WATCH] L2: Создаем контекст esbuild...');
    const ctx = await esbuild.context({
        entryPoints: ['src/main/index.ts', 'src/preload/index.ts'],
        bundle: true,
        platform: 'node',
        external: ['electron'],
        outdir: 'dist',
        plugins: [{
            name: 'rebuild-logger',
            setup(build) {
                build.onEnd(result => {
                    console.log('[WATCH] L4: Сборка завершена.');
                    if (result.errors.length > 0) {
                        console.error('[WATCH] L5_FAIL: Сборка провалилась!', result.errors);
                        return;
                    }
                    if (isFirstRun) {
                        console.log('[WATCH] L6: Первая сборка успешна. Запускаем Electron...');
                        isFirstRun = false;
                        startElectron();
                    } else {
                        console.log('[WATCH] L7: Повторная сборка успешна. Перезапускаем Electron...');
                        startElectron();
                    }
                });
            },
        }],
    });
    await ctx.watch();
    console.log('[WATCH] L8: Режим отслеживания активен.');
}

watch().catch(() => process.exit(1));