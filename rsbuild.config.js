import { defineConfig, loadEnv,  } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
const { publicVars } = loadEnv({ prefixes: ['REACT_APP_'] });

export default defineConfig({
    html: {
        template: './public/index.html',
    },
    output: {
        sourceMap: false,
        minify: true,
    },
    server: {
        host: process.env.TAURI_DEV_HOST,
        port: 1420,
        strictPort: true,
    },
    plugins: [
        pluginReact(),
        pluginSvgr({ mixedImport: true }),
    ],
    source: {
        define: publicVars,
        alias: () => {
            return {
                '@': './src/',
            };
        },
    },
});
