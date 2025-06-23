// services/frontend/dashboard/vite.config.ts
// Version 4 (local config with manualChunks for React, sanitizeFileName fix, and fileURLToPath typo fix)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url'; // Correct import

const __filename = fileURLToPath(import.meta.url); // Corrected function call
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        format: 'esm',
        sanitizeFileName(name) {
          return name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        },
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            // More robust check for React/ReactDOM to ensure they are chunked together
            // A single chunk for React and related core deps
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('@remix-run/router')
            ) {
              console.log(`[manualChunks DEBUG] React/Remix-related ID: ${id}`);
              return 'react-and-deps';
            } else {
              console.log(`[manualChunks DEBUG] Vendor ID: ${id}`); // Add this line for general vendor m odules
              return 'vendor';
            }
          }
          return undefined;
        }
      }
    }
  }
});
