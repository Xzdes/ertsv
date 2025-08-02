// build.mjs
import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/main/index.ts', 'src/preload/index.ts'],
    bundle: true,
    platform: 'node',
    external: ['electron'],
    outdir: 'dist',
}).catch(() => process.exit(1));