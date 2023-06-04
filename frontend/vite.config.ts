import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Replace with the actual backend URL if needed
        changeOrigin: true,
      },
    },
  },
});
