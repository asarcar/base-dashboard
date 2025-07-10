// services/frontend/dashboard/vite.config.ts
// Version 6: simplify and remove debug code
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reactPath = 'react';
const reactDomPath = 'react-dom';
const atPath = path.resolve(__dirname, './src');

const resolveAlias = {
  react: reactPath,
  'react-dom': reactDomPath,
  '@': atPath
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias: resolveAlias }
});
