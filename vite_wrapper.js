// services/frontend/dashboard/vite_wrapper.js
// ESM module (not CommonJS) to be compatible with Vite
// Version 27: use Bazel runfiles to resolve Vite binary path
import fs from 'fs';
import path from 'path';
import util from 'util';

import { exit } from 'process';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();
const ENV = process.env;

// e.g. 'services/frontend/dashboard/_vite_tool_/_vite_tool'
const viteRelPath = ENV.VITE_BINARY_PATH;
const viteBinPath = path.resolve(CWD, viteRelPath);
const viteConfigRelPath = ENV.VITE_CONFIG_PATH;
const viteConfigPath = path.resolve(CWD, viteConfigRelPath);
// Define log file paths early
// This is the internal debug log of the wrapper script itself
const viteWrapperDebugFile = path.join(CWD, 'vite_wrapper_debug.txt');
// This is where Vite's stdout/stderr is redirected
const viteBuildOutputFile = path.join(CWD, 'vite_build_output.txt');

// Prepare arguments for Vite process
const viteArgs = process.argv.slice(2);

// Open write streams for logging
const viteOutputStream = fs.createWriteStream(viteBuildOutputFile);
const debugOutputStream = fs.createWriteStream(viteWrapperDebugFile);

// Preserve original console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Override console methods to automatically prepend prefix and log to debug file
console.log = function (...args) {
  originalConsoleLog.apply(console, ['[vite_wrapper.js]', ...args]);
  const formattedArgs = args
    .map((arg) =>
      typeof arg === 'object' ? util.inspect(arg, { depth: null }) : arg
    )
    .join(' ');
  debugOutputStream.write(
    `[vite_wrapper.js Debug] ${new Date().toISOString()} ${formattedArgs}\n`
  );
};

console.error = function (...args) {
  originalConsoleError.apply(console, ['[vite_wrapper.js]', ...args]);
  const formattedArgs = args
    .map((arg) =>
      typeof arg === 'object' ? util.inspect(arg, { depth: null }) : arg
    )
    .join(' ');
  debugOutputStream.write(
    `[vite_wrapper.js Debug] ${new Date().toISOString()} ERROR: ${formattedArgs}\n`
  );
};

// Function to close streams and exit the process gracefully
// This function ensures that both the Vite output stream
// and the debug stream are closed before exiting.
function closeStreams() {
  viteOutputStream.end();
  debugOutputStream.end();
}

// Now, all these console.log calls will automatically get the '[vite_wrapper.js]' prefix
console.log(`Version 26 Wrapper script starting. CWD: ${CWD}`);
console.log(`__dirname (of wrapper script): ${__dirname}`);
console.log(`Vite Binary relative path: ${viteRelPath}`);
console.log('Vite Binary full path: ', viteBinPath);
console.log('Vite Configuration path: ', viteConfigPath);
console.log(`Current execpath: ${process.execPath}`);
console.log(`Received arguments: ${process.argv.slice(2).join(' ')}`);
console.log(`Vite's (stdout/stderr) at: ${viteBuildOutputFile}`);
console.log(`Vite wrapper internal debug logs at: ${viteWrapperDebugFile}`);

// Validate all paths to binary, configuration, and arguments are correct
if (!viteBinPath || !fs.existsSync(viteBinPath)) {
  console.error(
    `FATAL: Vite binary ${viteBinPath} not found at ${viteRelPath}`
  );
  process.exit(1);
}
if (!viteConfigPath || !fs.existsSync(viteConfigPath)) {
  console.error(
    `FATAL: Vite binary ${viteConfigPath} not found at ${viteConfigRelPath}`
  );
  process.exit(1);
}
if (process.argv.length <= 2) {
  console.log('Target is meant to be used as a tool, not run directly.');
  process.exit(0);
}

const viteFinalArgs = [...viteArgs, '--config', viteConfigPath];
const viteProcess = spawn(viteBinPath, viteFinalArgs, {
  // Inherit stdin, pipe stdout/stderr to files
  stdio: ['inherit', 'pipe', 'pipe'],
  // Set working directory to where vite.config.*.ts is located
  cwd: path.dirname(viteConfigPath),
  env: ENV
});
console.log(
  `Vite child process spawned with PID: ${viteProcess.pid} and args: ${viteFinalArgs.join(' ')}`
);

// Pipe Vite's stdout and stderr to the designated output file
viteProcess.stdout.pipe(viteOutputStream);
viteProcess.stderr.pipe(viteOutputStream);

// Handle Vite process events
viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}.`);
  // Ensure all streams are flushed and closed when Vite process closes
  closeStreams();
  process.exit(code); // Propagate the exit code of the Vite process
});

viteProcess.on('error', (err) => {
  console.error(
    `[FAILURE] Failed to start or run Vite process: ${err.message}`
  );
  closeStreams(); // Exit with error code
  process.exit(1);
});

// Handle graceful shutdown of the wrapper script itself (e.g., Ctrl-C)
const handleExit = (signal) => {
  console.log(`Received signal ${signal}. Attempting graceful shutdown...`);
  if (!viteProcess || viteProcess.killed) {
    // If Vite process is not running or already killed
    // just close streams and exit gracefully
    console.log('Vite process not active, closing streams directly.');
    closeStreams();
    process.exit(0); // Exit gracefully
  }
  // If Vite process is running, kill it with the received signal
  console.log(`Killing child Vite process with signal ${signal}...`);
  // Propagate the signal to the child Vite process
  viteProcess.kill(signal);
  // Process will exit gracefully was viteProcess.on('close') will be called
  // once all listeners are done which will close the streams and exit
};

process.on('SIGINT', handleExit); // Ctrl-C
process.on('SIGTERM', handleExit); // Termination signal

// Print summary to the main console
console.log(`\n--- Vite Process Summary ---`);
console.log(
  `Vite's full output (stdout/stderr) is available at: ${viteBuildOutputFile}`
);
console.log(
  `Internal wrapper debug logs is available at: ${viteWrapperDebugFile}`
);
console.log(`Waiting for Vite Process to complete...`);
