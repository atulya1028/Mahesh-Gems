import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // For routing to work on Vercel
  build: {
    outDir: 'dist', // Vercel expects the build folder to be `dist`
  },
});
