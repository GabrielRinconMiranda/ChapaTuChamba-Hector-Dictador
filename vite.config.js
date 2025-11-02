import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Config especial para StackBlitz
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceso dentro del WebContainer
    port: 3000,
    strictPort: true,
  },
  build: {
    sourcemap: false, // evita errores "could not find source file"
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // mejora compatibilidad con WebContainer
    },
  },
});
