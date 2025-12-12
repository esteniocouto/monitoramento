import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Garante que falhe se a porta estiver ocupada, em vez de mudar para 5174
    host: true
  }
});