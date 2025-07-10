// src/global.d.tsx
export {};

declare global {
  interface ReactDevToolsHook {
    renderers: Map<number, { rendererPackageName: string }>;
    inject: (injected: unknown) => number;
    onCommitFiberRoot: (
      rendererId: number,
      root: unknown,
      priorityLevel: number
    ) => void;
    onScheduleFiberRoot?: (
      rendererId: number,
      root: unknown,
      priorityLevel: number
    ) => void;
    // Add more if needed
  }

  interface Window {
    react?: typeof import('react');
    reactRouterDom?: typeof import('react-router-dom');
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsHook;
  }
}
