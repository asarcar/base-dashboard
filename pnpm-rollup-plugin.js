// services/frontend/dashboard/pnpm-rollup-plugin.js
// Version 40 (final): Optimized resolution flow by deferring relative/absolute paths early.

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const require = createRequire(import.meta.url);

/**
 * A Rollup plugin for resolving modules in pnpm/Bazel environments.
 * It aims to correctly resolve bare module specifiers and problematic subpath imports
 * by first attempting manual resolution, then using `require.resolve`, and finally
 * deferring to other Rollup/Vite resolvers.
 *
 * This plugin should be placed early in the Vite plugins array.
 *
 * @returns {import('rollup').Plugin} Rollup plugin object
 */
function pnpmResolutionPlugin() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pluginDir = __dirname; // This is the directory where the plugin file itself resides.
  const currentWorkingDir = process.cwd(); // This is the directory where the build command is executed.

  console.log(`[pnpm-resolution-plugin] INIT: Plugin version 40 starting up.`);
  console.log(
    `[pnpm-resolution-plugin]   Current Working Directory (process.cwd()): ${currentWorkingDir}`
  );
  console.log(
    `[pnpm-resolution-plugin]   Plugin Directory (__dirname): ${pluginDir}`
  );

  // Explicitly set baseNodeModulesPath based on CWD as per user's confirmation
  const baseNodeModulesPath = path.join(currentWorkingDir, 'node_modules');

  console.log(
    `[pnpm-resolution-plugin]   Base Node Modules Search Path (CWD/node_modules): ${baseNodeModulesPath}`
  );
  if (!fs.existsSync(baseNodeModulesPath)) {
    console.warn(
      `[pnpm-resolution-plugin] WARN: CWD/node_modules path '${baseNodeModulesPath}' doesn't exist. Module resolution might be affected.`
    );
  }

  return {
    name: 'pnpm-resolution-plugin',
    resolveId(source, importer, options) {
      // VERY_DEBUG: Log every single call to resolveId
      console.log(
        `[pnpm-resolution-plugin] VERY_DEBUG: resolveId called for source: '${source}' from importer: '${importer}' (isEntry: ${options.isEntry}, isExternal: ${options.isExternal})`
      );

      // CRITICAL FIX: Defer Vite's internal preload-helper.js to Vite's own resolver
      if (source.includes('vite/preload-helper.js')) {
        console.log(
          `[pnpm-resolution-plugin] DEBUG: Deferring 'vite/preload-helper.js' resolution to Vite's internal process to fix runtime error.`
        );
        return null; // Let Vite handle it
      }

      // Defer resolution for relative/absolute paths immediately.
      // This plugin's primary purpose is to fix bare module specifier resolution.
      if (
        source.startsWith('.') ||
        source.startsWith('/') ||
        source.includes(':')
      ) {
        console.log(
          `[pnpm-resolution-plugin] DEBUG: Deferring relative/absolute/protocol path '${source}' to Rollup/Vite's default mechanism.`
        );
        return null; // Let Rollup/Vite's default resolver handle it
      }

      // Now, only attempt custom resolution for bare module specifiers
      // console.log(`[pnpm-resolution-plugin] DEBUG: Attempting to resolve bare specifier: '${source}'`);

      const searchPaths = [];

      // Add importer's directory as a search path if available (for relative bare specifiers in monorepos)
      if (importer) {
        const importerDir = path.dirname(importer);
        searchPaths.push(importerDir);
      }

      // Add the current working directory and its node_modules
      searchPaths.push(currentWorkingDir);
      searchPaths.push(baseNodeModulesPath);

      // Always add plugin directory and its node_modules.
      // Redundancy will be handled by uniqueSearchPaths.
      searchPaths.push(pluginDir);
      searchPaths.push(path.join(pluginDir, 'node_modules'));

      // Remove duplicates and filter out non-existent paths before passing to require.resolve
      const uniqueSearchPaths = [...new Set(searchPaths)].filter((p) =>
        fs.existsSync(p)
      );

      // console.log(`[pnpm-resolution-plugin] DEBUG: Attempting require.resolve for '${source}' with paths:`, uniqueSearchPaths);

      for (const searchPath of uniqueSearchPaths) {
        try {
          const resolvedPath = require.resolve(source, { paths: [searchPath] });
          // console.log(`[pnpm-resolution-plugin] DEBUG: Successfully resolved '${source}' to '${resolvedPath}' via require.resolve with path '${searchPath}'.`);
          return { id: resolvedPath };
        } catch (e) {
          // console.log(`[pnpm-resolution-plugin] DEBUG (require.resolve failed): Could not resolve '${source}' in path '${searchPath}'. Error: ${e.message}`);
          // Continue to the next searchPath if one fails
        }
      }

      // If require.resolve fails for a bare specifier, try manual path construction
      // This is a fallback for pnpm's symlinked structure.
      if (baseNodeModulesPath) {
        const manualAttemptPaths = [
          // Common pnpm structure: module is directly in .pnpm/
          path.join(
            baseNodeModulesPath,
            '.pnpm',
            source.replace(/\//g, '+'),
            'node_modules',
            source
          ),
          // Attempt to resolve based on common packages that are direct deps
          path.join(baseNodeModulesPath, source)
        ];

        for (const manualPath of manualAttemptPaths) {
          try {
            if (
              fs.existsSync(manualPath) ||
              fs.existsSync(`${manualPath}.js`) ||
              fs.existsSync(`${manualPath}/index.js`)
            ) {
              console.log(
                `[pnpm-resolution-plugin] DEBUG: Manually resolved '${source}' to '${manualPath}'.`
              );
              return { id: manualPath };
            }
          } catch (manualError) {
            // Continue to the next searchPath if one fails
          }
        }
      }

      console.warn(
        `[pnpm-resolution-plugin] WARN: Could not resolve bare specifier '${source}' via any custom paths. Deferring resolution to Rollup/Vite's default mechanism.`
      );
      return null; // Defer to Rollup/Vite's default resolver
    }
  };
}

export default pnpmResolutionPlugin;
