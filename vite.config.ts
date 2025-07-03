// services/frontend/dashboard/vite.config.ts
// Version 5 (require.resolve for react and react-dom)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url'; // Correct import

const __filename = fileURLToPath(import.meta.url); // Corrected function call
const __dirname = path.dirname(__filename);

console.log(`[vite.config.ts]: version 5 called`);

export default defineConfig({
  plugins: [react()],
  resolve: {
    // preserveSymlinks: true, // leave preserveSymlinks to default=false
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    minify: false,
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
          console.log(`[manualChunks DEBUG] ID: ${id}`);
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-jsx-runtime') ||
              id.includes('@remix-run/router')
            ) {
              console.log(
                `[manualChunks DEBUG] React/Remix-related ID: ${id} -> assigned to 'react-and-deps'`
              );
              return 'react-and-deps';
            } else {
              console.log(
                `[manualChunks DEBUG] Vendor ID: ${id} -> assigned to 'vendor'`
              );
              return 'vendor';
            }
          }
          // Default behavior for app code (not in node_modules) or if no custom rule applies
          return undefined; // Return undefined to let Rollup's default chunking handle it
        }
      }
    }
  },
  // port used for local rendering via bazel run
  server: {
    port: 3080,
    open: false,
    cors: true
  }
});
