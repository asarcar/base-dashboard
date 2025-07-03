// services/frontend/dashboard/vite.config.bazelprod.ts
// Version 22: Forcing ES Modules

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`[vite.config.bazelprod.ts]: version 22 called`);

// Custom plugin to enforce ES Modules and block CommonJS require() statements - new-2
function forceESModules() {
  return {
    name: 'force-es-modules',
    generateBundle(options, bundle) {
      console.log(
        '[vite.config.bazelprod.ts]: version 22 - Forcing ES Modules'
      );
      // Log and block any files with require() statements
      Object.keys(bundle).forEach((fileName) => {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          if (
            chunk.code.includes('require(') ||
            chunk.code.includes('require.')
          ) {
            console.error(
              `❌ BLOCKING: ${fileName} contains require() statements`
            );
            console.error(
              'First require() occurrence:',
              chunk.code.substring(
                chunk.code.indexOf('require'),
                chunk.code.indexOf('require') + 50
              )
            );
            throw new Error(
              `CommonJS require() detected in ${fileName} - this will fail in browser`
            );
          }
        }
      });
      console.log('✅ SUCCESS: No require() statements found in bundle');
    }
  };
}

export default defineConfig({
  plugins: [
    react(), // Keep JSX/babel/SWC transforms
    forceESModules() // Custom CJS detection plugin - new-2
  ],
  resolve: {
    // restore full ESModule resolution priority - new-4
    conditions: ['es2015', 'module', 'import', 'default'], // new-4
    mainFields: ['module', 'main'], // new-4
    alias: {
      // use browser-compatible ESM build of axios - new-5
      axios: path.resolve(__dirname, 'node_modules/axios/dist/esm/axios.js'),
      react: 'react',
      'react-dom': 'react-dom',
      // uncomment bazel-specific paths for react, react-dom, react-dom/client
      // only if needed - new-7
      // react: '/home/asarcar/.cache/bazel/_bazel_asarcar/b2143282093dcce9a4fc9cc0918cd4f4/execroot/_main/bazel-out/k8-dbg/bin/services/frontend/dashboard/node_modules/.aspect_rules_js/react@18.3.1/node_modules/react/index.js',
      // 'react-dom': '/home/asarcar/.cache/bazel/_bazel_asarcar/b2143282093dcce9a4fc9cc0918cd4f4/execroot/_main/bazel-out/k8-dbg/bin/services/frontend/dashboard/node_modules/.aspect_rules_js/react-dom@18.3.1_react_18.3.1/node_modules/react-dom/index.js',
      // 'react-dom/client': '/home/asarcar/.cache/bazel/_bazel_asarcar/b2143282093dcce9a4fc9cc0918cd4f4/execroot/_main/bazel-out/k8-dbg/bin/services/frontend/dashboard/node_modules/.aspect_rules_js/react-dom@18.3.1_react_18.3.1/node_modules/react-dom/client.js',
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"', // new-1
    global: 'globalThis' // new-1
  },
  build: {
    target: 'es2020', // new-1
    // minify: 'esbuild', // Use esbuild instead of terser - new-3
    minify: false, // Disable minification for debugging - new-8
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Enhanced external configuration only if feeding from UMD/CDN - new-100
      // external: ['react', 'react-dom', 'react-dom/client'],
      // Force all modules to be treated as ES modules
      // treeshake: { moduleSideEffects: false },
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        format: 'esm',
        // Ensure all chunks are ESM - new-6
        // manualChunks: undefined, // new-6
        // inlineDynamicImports: true, // new-6
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
  // Optimize dependencies - new-3
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
    esbuildOptions: {
      target: 'es2020',
      format: 'esm' // Force ESM format
    }
  },
  // Ensure proper module handling - new-3
  ssr: {
    format: 'esm',
    target: 'node'
  },
  // port used for local rendering via bazel run
  server: {
    port: 3080,
    open: false,
    cors: true
  }
});
