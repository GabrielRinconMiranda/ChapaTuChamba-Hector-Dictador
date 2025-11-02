// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 3000,
    strictPort: true,
    
    // CONFIGURACIÓN DEL PROXY ANTI-CORS ACTUALIZADA
    proxy: {
      // Fuentes existentes
      '/api/remotive': {
        target: 'https://remotive.io', 
        changeOrigin: true,            
        rewrite: (path) => path.replace('/api/remotive', '/api/remote-jobs'), 
      },
      '/api/remoteok': {
        target: 'https://remoteok.io', 
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/remoteok', '/api'),
      },
      
      // 🔥 NUEVAS FUENTES 🔥
      // 1. Proxy para WeWorkRemotely (WWR)
      '/api/wwr': {
        target: 'https://weworkremotely.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/wwr', '/api/v1/jobs/latest'),
      },
      // 2. Proxy para Jobicy (JBY)
      '/api/jobicy': {
        target: 'https://jobicy.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/jobicy', '/api/v2/remote-jobs'),
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