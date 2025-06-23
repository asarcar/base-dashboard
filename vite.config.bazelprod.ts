// services/frontend/dashboard/vite.config.bazelprod.ts
// Version 8: Robust path normalization in manualChunks for Bazel builds.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

import pnpmResolutionPlugin from './pnpm-rollup-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`[vite.config.bazelprod.ts]: version 8 called`);

// No longer checking for isBazelProdBuild as this config is explicitly for it.
// console.log(`[vite.config.bazelprod.ts] process.env.NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`[vite.config.bazelprod.ts] process.env.BAZEL_BINDIR: ${process.env.BAZEL_BINDIR}`);

export default defineConfig({
  plugins: [pnpmResolutionPlugin(), react()].filter(Boolean),
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
          let normalizedId = id;

          // Find the start of the 'node_modules/' path within the ID.
          // This handles both the sandboxed and non-sandboxed Bazel prefixes,
          // as they both eventually contain 'node_modules/'.
          const nodeModulesIndex = id.indexOf('node_modules/');
          if (nodeModulesIndex !== -1) {
            normalizedId = id.substring(nodeModulesIndex);
          }
          // If a module ID does not contain 'node_modules/', it's likely application code
          // or a very specific external path that should not be normalized this way.

          // You can uncomment these console.logs for debugging if needed:
          console.log(`[manualChunks DEBUG] Original ID: ${id}`);
          console.log(`[manualChunks DEBUG] Normalized ID: ${normalizedId}`);

          if (normalizedId.includes('node_modules')) {
            // Now, check against the normalized ID, which should consistently
            // start with 'node_modules/' regardless of Bazel's initial path.
            if (
              normalizedId.includes('react') ||
              normalizedId.includes('react-dom') ||
              normalizedId.includes('react-jsx-runtime') ||
              normalizedId.includes('@remix-run/router')
            ) {
              console.log(
                `[manualChunks DEBUG] React/Remix-related Normalized ID: ${normalizedId} -> assigned to 'react-and-deps'`
              );
              return 'react-and-deps';
            } else {
              console.log(
                `[manualChunks DEBUG] Vendor Normalized ID: ${normalizedId} -> assigned to 'vendor'`
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
  server: {
    port: 3000,
    open: false,
    cors: true
  }
});
