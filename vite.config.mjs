import { fileURLToPath, URL } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    // optimizeDeps: {
    //     noDiscovery: true // Agar zarurat ho to isse enable karein
    // },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: { 
        port: 8080,
        proxy: {
            '/api': {
                target: process.env.VITE_BASE_URL, // Changed to VITE_BASE_URL
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/,  '/api'),
            },
        },
    },
});
