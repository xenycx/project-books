import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  optimizeDeps: {
    include: ['lucide-react'], // Include instead of exclude
  },
  server: {
    port: 3000,
    open: true,
  },
});