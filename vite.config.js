import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                switch (format) {
                    case 'es':
                        return 'index.mjs';
                    case 'cjs':
                        return 'index.js';
                    default:
                        throw new Error(`Unexpected format: ${format}`);
                }
            },
        },
        target: 'es2017',
        minify: false,
    },
    plugins: [
        dts(),
    ],
});
