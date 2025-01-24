import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'], // Include instead of exclude
  },
  server: {
    port: 3000,
    open: true
  }
});