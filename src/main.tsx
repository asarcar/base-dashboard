// services/frontend/dashboard/src/main.tsx
/**
 * Version 5 - Real App + Debug Tools
 * Changes: Integrate real App component alongside DebugReactImports and BundleAnalyzer
 * React import: namespace to avoid invalid default import behavior in ESM
 */

import * as React from 'react';
// DEBUG - expose React globally for debugging
(window as any).React = React;
import * as ReactDOM from 'react-dom/client';
// import { Root } from 'vaul'
import App from './App.tsx';
import '@/index.css'; // Import global styles
import DebugReactImports from './DebugReactImports';

// Bundle Analyzer Component
const BundleAnalyzer: React.FC = () => {
  const [analysis, setAnalysis] = React.useState<string>('Analyzing...');

  React.useEffect(() => {
    // Analyze the runtime React instances
    const reactInstances = [];

    // Check if we have multiple React instances
    if (typeof window !== 'undefined') {
      // Check global React
      if ((window as any).React) {
        reactInstances.push('window.React found');
      }

      // Check current React instance
      reactInstances.push(`Current React version: ${React.version}`);

      // Check for React DevTools
      if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.renderers && hook.renderers.size > 0) {
          reactInstances.push(
            `React DevTools detects ${hook.renderers.size} renderer(s)`
          );
        }
      }
    }

    const result =
      reactInstances.length > 0
        ? reactInstances.join('\n')
        : 'No React instance conflicts detected';

    setAnalysis(result);
  }, []);

  return React.createElement(
    'div',
    {
      style: {
        backgroundColor: '#f0f8ff',
        position: 'relative', // or 'fixed'
        zIndex: 9999,
        background: '#fff',
        color: '#222',
        padding: '16px',
        border: '2px solid #2196F3',
        borderRadius: '8px',
        margin: '10px'
      }
    },
    [
      React.createElement('h3', { key: 'title' }, 'Runtime Bundle Analysis'),
      React.createElement(
        'pre',
        {
          key: 'analysis',
          style: {
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px'
          }
        },
        analysis
      )
    ]
  );
};

// Unified Root Component
const RootComponent: React.FC = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return React.createElement('div', {}, [
    isProd ? React.createElement(DebugReactImports, { key: 'debug' }) : null,
    isProd ? React.createElement(BundleAnalyzer, { key: 'analyzer' }) : null,
    isProd
      ? React.createElement(
          'p',
          { key: 'desc' },
          '✅ Hello from React + Vite + Bazel Debug Sanity Check!'
        )
      : null,
    React.createElement(App, { key: 'app' })
  ]);
};

console.log('📦 React (main):', React || 'Unknown React');
console.log('🔎 typeof React (main):', typeof React);
console.log('🔎 React.version (main):', React?.version);
console.log(
  '🔍 ReactDOM.createRoot available (main):',
  typeof ReactDOM?.createRoot === 'function'
);
console.log('🔎 typeof React.useLayoutEffect:', typeof React?.useLayoutEffect);
console.log('📦 ReactDOM (main):', ReactDOM || 'Unknown ReactDom');
console.log('🔎 typeof ReactDOM (main):', typeof ReactDOM);
console.log(
  '🔎 typeof ReactDOM.createRoot (main):',
  typeof ReactDOM?.createRoot
);

// Render the app
const container = document.getElementById('root');
console.log('🔍 Container found (main):', !!container);
if (!container) throw new Error('Root element not found');

const root = ReactDOM.createRoot(container);
console.log('🔍 Root created (main):', !!root);

try {
  root.render(React.createElement(RootComponent));
  console.log('✅ React rendered successfully (main');
} catch (e) {
  console.error('❌ React render failed (main):', e);
}

console.log('🧩 window.React === React? (main)', window.React === React);
console.log('React === window.React? (main)', React === (window as any).React);
