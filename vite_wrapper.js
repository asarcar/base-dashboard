// services/frontend/dashboard/vite_wrapper.js
// ESM module (not CommonJS) to be compatible with Vite
// Version 26: Switched to async spawn for graceful shutdown and log flushing.

import util from 'util';
import path from 'path';
import { spawn } from 'child_process'; // Changed from spawnSync to spawn
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exit } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nodeModulesPath = path.join(__dirname, 'node_modules');
const viteBin = path.join(nodeModulesPath, 'vite', 'bin', 'vite.js');
const CWD = process.cwd();
const ENV = process.env;

// Define log file paths early
const viteWrapperDebugFile = path.join(CWD, 'vite_wrapper_debug.txt'); // This is the internal debug log of the wrapper script itself
const viteBuildOutputFile = path.join(CWD, 'vite_build_output.txt'); // This is where Vite's stdout/stderr is redirected

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

// Now, all these console.log calls will automatically get the '[vite_wrapper.js]' prefix
console.log(`Version 26 Wrapper script starting. CWD: ${CWD}`);
console.log(`__dirname (of wrapper script): ${__dirname}`);
console.log('Node Modules Path ', nodeModulesPath);
console.log('Vite Binary ', viteBin);
console.log(`Current execpath: ${process.execPath}`);
console.log(`Received arguments: ${process.argv.slice(2).join(' ')}`);
console.log(
  `Vite's full output (stdout/stderr) is available at: ${viteBuildOutputFile}`
);
console.log(
  `Vite wrapper internal debug logs is available at: ${viteWrapperDebugFile}`
);

if (!fs.existsSync(viteBin)) {
  console.error(`FATAL: Vite binary not found at ${viteBin}`);
  // Ensure logs are flushed before exiting on error
  debugOutputStream.end();
  viteOutputStream.end();
  process.exit(1);
}

// Spawn the Vite process asynchronously
const viteProcess = spawn(process.execPath, [viteBin, ...viteArgs], {
  stdio: ['inherit', 'pipe', 'pipe'], // Inherit stdin, pipe stdout/stderr to files
  cwd: CWD,
  env: ENV // Pass through environment variables
});
console.log(
  `Vite child process spawned with PID: ${viteProcess.pid} and args: ${viteArgs.join(' ')}`
);

// Pipe Vite's stdout and stderr to the designated output file
viteProcess.stdout.pipe(viteOutputStream);
viteProcess.stderr.pipe(viteOutputStream);

// Handle Vite process events
viteProcess.on('close', (code) => {
  console.log(`Vite process exited with code ${code}.`);
  // Ensure all streams are flushed and closed when Vite process closes
  viteOutputStream.end();
  debugOutputStream.end();
  process.exit(code); // Propagate the exit code of the Vite process
});

viteProcess.on('error', (err) => {
  console.error(
    `[FAILURE] Failed to start or run Vite process: ${err.message}`
  );
  // Ensure streams are flushed on error
  viteOutputStream.end();
  debugOutputStream.end();
  process.exit(1); // Exit with an error code
});

// Handle graceful shutdown of the wrapper script itself (e.g., Ctrl-C)
const handleExit = (signal) => {
  console.log(`Received signal ${signal}. Attempting graceful shutdown...`);
  if (viteProcess && !viteProcess.killed) {
    console.log(`Killing child Vite process with signal ${signal}...`);
    viteProcess.kill(signal); // Propagate the signal to the child Vite process
  } else {
    // If Vite process is already killed or not running, just close streams
    console.log('Vite process not active, closing streams directly.');
    viteOutputStream.end();
    debugOutputStream.end();
    process.exit(0); // Exit gracefully
  }
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
console.log(
  `Vite child process spawned with PID: ${viteProcess.pid} and args: ${viteArgs.join(' ')}`
);
console.log(`For dev runs open browser with URL/port`);
