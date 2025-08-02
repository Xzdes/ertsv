// start.cjs
const waitOn = require('wait-on');
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

console.log('[START] Скрипт запущен. Ожидаем Vite сервер...');

const waitOnOptions = {
    resources: ['tcp:5173'],
    timeout: 30000,
};

async function launchElectron() {
    try {
        await waitOn(waitOnOptions);
        
        console.log('[START] Vite сервер готов! Запускаем Electron...');
        
        // ★★★ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: СОЗДАЕМ АБСОЛЮТНЫЙ ПУТЬ ★★★
        const entryPoint = path.join(__dirname, 'dist', 'main.js');
        console.log(`[START] АБСОЛЮТНЫЙ ПУТЬ К ТОЧКЕ ВХОДА: ${entryPoint}`);
        
        const electronProcess = spawn(electron, [entryPoint], { 
            stdio: 'inherit',
            env: { ...process.env, NODE_ENV: 'development' } 
        });
        
        electronProcess.on('close', (code) => {
            console.error(`[START] Процесс Electron завершился с кодом: ${code}.`);
            process.exit(code);
        });
        
    } catch (err) {
        console.error('[START] Ошибка ожидания или запуска:', err);
        process.exit(1);
    }
}

launchElectron();