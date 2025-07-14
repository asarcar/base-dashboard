// services/frontend/dashboard/jest_wrapper.mjs
// jest_wrapper.mjs - ESM module for Bazel/Jest integration
import path from 'path';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();
const ENV = process.env;

const jestRelPath = ENV.JEST_BINARY_PATH;
const jestBinPath = path.resolve(CWD, jestRelPath);
const jestConfigRelPath = ENV.JEST_CONFIG_PATH;
const jestConfigPath = path.resolve(CWD, jestConfigRelPath);
if (!jestConfigPath || !fs.existsSync(jestConfigPath)) {
  console.error(
    `FATAL: Vite binary ${jestConfigPath} not found at ${jestConfigRelPath}`
  );
  process.exit(1);
}

if (!fs.existsSync(jestBinPath)) {
  console.error(`Jest binary not found at ${jestBinPath}`);
  process.exit(1);
}
if (!fs.existsSync(jestConfigPath)) {
  console.error(`Jest config not found at ${jestConfigPath}`);
  process.exit(1);
}

// Optional: Debugging output
console.log('Jest Wrapper: Starting...');
console.log('CWD:', CWD);
console.log('__dirname:', __dirname);
console.log('Jest Binary:', jestBinPath);
console.log('Jest Config Path:', jestConfigPath);

const jestFinalArgs = [...process.argv.slice(2), '--config', jestConfigPath];
const jestProcess = spawnSync(jestBinPath, jestFinalArgs, {
  stdio: 'inherit',
  // Set working directory to where jest.config.cjs is located
  cwd: path.dirname(jestConfigPath),
  env: ENV
});
console.log(
  `Child process spawned with PID: ${jestProcess.pid} and args: ${jestFinalArgs.join(' ')}`
);

process.exit(jestProcess.status || 0);
