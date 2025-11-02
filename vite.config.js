// vite.config.js (Modificación: Añadir opciones de conexión al proxy)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Valor en milisegundos para el timeout (ej: 30 segundos)
const PROXY_TIMEOUT = 30000; 

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 3000,
    strictPort: true,
    
    proxy: {
      // Configuraciones base para todas las APIs
      '/api/remotive': {
        target: 'https://remotive.io', 
        changeOrigin: true,            
        rewrite: (path) => path.replace('/api/remotive', '/api/remote-jobs'),
        // 🔥 AÑADIR CONFIGURACIÓN DE TIME-OUT/SEGURIDAD 🔥
        proxyTimeout: PROXY_TIMEOUT,
        secure: false, // Ignorar posibles errores de SSL/TLS
      },
      '/api/remoteok': {
        target: 'https://remoteok.io', 
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/remoteok', '/api'),
        // 🔥 AÑADIR CONFIGURACIÓN DE TIME-OUT/SEGURIDAD 🔥
        proxyTimeout: PROXY_TIMEOUT,
        secure: false,
      },
      '/api/wwr': {
        target: 'https://weworkremotely.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/wwr', '/api/v1/jobs/latest'),
        proxyTimeout: PROXY_TIMEOUT,
        secure: false,
      },
      '/api/jobicy': {
        target: 'https://jobicy.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/jobicy', '/api/v2/remote-jobs'),
        proxyTimeout: PROXY_TIMEOUT,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: false, 
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
});