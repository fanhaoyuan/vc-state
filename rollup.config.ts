import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild, { minify } from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import { module, main, browser, typings } from './package.json';
import rm from 'rimraf';

const input = 'index.ts';
const external = ['vue'];

rm.sync('dist');

export default defineConfig([
    {
        input,
        plugins: [nodeResolve(), commonjs(), esbuild({ target: 'esnext' })],
        external,
        output: [
            {
                format: 'esm',
                file: module,
            },
            {
                format: 'cjs',
                file: main,
                exports: 'auto',
            },
            {
                format: 'umd',
                file: browser,
                plugins: [minify()],
                globals: {
                    vue: 'Vue',
                },
                name: 'VState',
            },
        ],
    },
    {
        input,
        plugins: [dts()],
        output: {
            format: 'esm',
            file: typings,
        },
    },
]);
