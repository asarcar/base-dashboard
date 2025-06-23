// services/frontend/dashboard/pnpm-rollup-plugin.d.ts

// Import Rollup's Plugin type from the 'rollup' package
// (This requires `@types/rollup` to be installed as a dev dependency)
import { Plugin } from 'rollup';

/**
 * Declares the shape of the pnpmResolutionPlugin function.
 * It's a function that returns a Rollup Plugin object.
 */
declare function pnpmResolutionPlugin(): Plugin;

export default pnpmResolutionPlugin;
