// services/frontend/dashboard/jest_wrapper.mjs
// jest_wrapper.mjs - ESM module for Bazel/Jest integration
import path from 'path';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nodeModulesPath = path.join(__dirname, 'node_modules');
const jestBin = path.join(nodeModulesPath, 'jest', 'bin', 'jest.js');
const configPath = path.join(__dirname, 'jest.config.cjs');

// Optional: Debugging output
console.log('Jest Wrapper: Starting...');
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Node Modules Path:', nodeModulesPath);
console.log('Jest Binary:', jestBin);
console.log('Config Path:', configPath);

if (!fs.existsSync(jestBin)) {
  console.error(`Jest binary not found at ${jestBin}`);
  process.exit(1);
}
if (!fs.existsSync(configPath)) {
  console.error(`Jest config not found at ${configPath}`);
  process.exit(1);
}

// Replace --config=... with the resolved config path
const args = process.argv
  .slice(2)
  .map((arg) => (arg.startsWith('--config=') ? `--config=${configPath}` : arg));

// Always include --experimental-vm-modules for Jest ESM support
const nodeArgs = ['--experimental-vm-modules', jestBin, ...args];

const result = spawnSync(process.execPath, nodeArgs, {
  stdio: 'inherit',
  cwd: process.cwd()
});

process.exit(result.status || 0);
