// vite_wrapper.js - ESM module (not CommonJS) to be compatible with Vite
// This script is a wrapper for the Vite CLI, allowing it to be run in a Bazel environment.
// It sets up the necessary paths and arguments for Vite to function correctly
// when executed from Bazel.
// It uses the spawnSync method from the child_process module to execute the Vite binary
// with the same arguments passed to this script.
import path from 'path';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nodeModulesPath = path.join(__dirname, 'node_modules');
const viteBin = path.join(nodeModulesPath, 'vite', 'bin', 'vite.js');

// Uncomment the following lines to enable debugging
// console.log('Vite Wrapper: Starting...');
// console.log('CWD:', process.cwd());
// console.log('__dirname:', __dirname);
// console.log('Node Modules Path:', nodeModulesPath);
// console.log('Vite Binary:', viteBin);

if (!fs.existsSync(viteBin)) {
  console.error(`Vite binary not found at ${viteBin}`);
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [viteBin, ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    cwd: process.cwd()
  }
);

process.exit(result.status || 0);
