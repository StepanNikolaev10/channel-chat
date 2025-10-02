import { defineConfig } from 'vite';

export default defineConfig({
    css: {
        modules: {
            localsConvention: 'dashes' 
        },
        preprocessorOptions: {
            scss: {} // сюда можно добавить переменные
        }
    }
});
