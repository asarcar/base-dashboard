// services/frontend/dashboard/vite.config.bazelprod.ts
// Version 24: Forcing react-router-dom path in alias to Bazel sandbox

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const axiosPath = path.resolve(__dirname, 'node_modules/axios');
const reactPath = path.resolve(__dirname, 'node_modules/react');
const reactDomPath = path.resolve(__dirname, 'node_modules/react-dom');
const reactRouterDomPath = path.resolve(
  __dirname,
  'node_modules/react-router-dom'
);
const atPath = path.resolve(__dirname, 'src');

const resolveAlias = {
  axios: axiosPath,
  react: reactPath,
  'react-dom': reactDomPath,
  'react-router-dom': reactRouterDomPath,
  '@': atPath
};

console.log(
  `[vite.config.bazelprod.ts]: version 24 called with dirname: ${__dirname}`
);
console.log('[vite] aliasing:', resolveAlias);

const optimizeDepsInclude = [
  // 'autoprefixer', // PostCSS plugin, not browser side
  'axios',
  'class-variance-authority',
  'clsx',
  'use-debounce',
  'lucide-react',
  // 'postcss', // Build time plugin, not browser side
  'react',
  'react-dom', // core rendering for React in the browser
  'react-dom/client', // separate subpath export providing new concurrent root API
  'react-error-boundary',
  'react-helmet-async',
  'react-hook-form',
  'react-router-dom',
  'tailwind-merge',
  // 'tailwindcss', // CLI, not used directly in app code
  'tailwindcss-animate',
  // 'vite', // CLI build tool, not runtime
  'zod',
  '@hookform/resolvers',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-icons',
  '@radix-ui/react-label',
  '@radix-ui/react-select',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-slot',
  '@radix-ui/react-tabs',
  '@radix-ui/react-tooltip',
  '@tanstack/react-query',
  '@tanstack/react-query-devtools',
  '@tanstack/react-table'
  // '@vitejs/plugin-react-swc', // vite plugin, not part of runtime deps
];

export default defineConfig({
  plugins: [react()],
  resolve: { alias: resolveAlias },
  build: { minify: false },
  optimizeDeps: { include: optimizeDepsInclude, force: true },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production')
  }
});
