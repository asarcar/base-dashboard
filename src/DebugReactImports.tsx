// services/frontend/dashboard/src/DebugReactImports.tsx
/**
 * Version 4 - 2025-06-30
 * Changes: Back to React.createElement approach - JSX runtime issues in Bazel
 * Previous: Version 3 - JSX syntax with manual esbuild configuration
 * Previous: Version 2 - React.createElement approach to avoid JSX runtime issues
 * Issue: "jsxs" is not exported by jsx-runtime.js in Bazel environment
 * Solution: React.createElement avoids JSX transformation entirely
 */

import * as React from 'react';

// Enhanced debugging to isolate the exact issue
export const DebugReactImports: React.FC = () => {
  // Test all the hooks that were causing issues
  const [state, setState] = React.useState('initialized');
  const refTest = React.useRef<string>('ref-working');
  const [effectCount, setEffectCount] = React.useState(0);
  const [layoutEffectCount, setLayoutEffectCount] = React.useState(0);

  // Test useEffect
  React.useEffect(() => {
    console.log('✅ useEffect: SUCCESS');
    setEffectCount((prev) => prev + 1);
  }, []);

  // Test useLayoutEffect (this was failing before)
  React.useLayoutEffect(() => {
    console.log('✅ useLayoutEffect: SUCCESS');
    setLayoutEffectCount((prev) => prev + 1);
  }, []);

  // Test useCallback
  const callbackTest = React.useCallback(() => {
    console.log('✅ useCallback: SUCCESS');
    return 'callback-working';
  }, []);

  // Test useMemo
  const memoTest = React.useMemo(() => {
    console.log('✅ useMemo: SUCCESS');
    return `memo-working-${Date.now()}`;
  }, []);

  // Test the callback
  React.useEffect(() => {
    callbackTest();
  }, [callbackTest]);

  return React.createElement(
    'div',
    {
      style: {
        // padding: '20px',
        // border: '2px solid #4CAF50',
        // borderRadius: '8px',
        // margin: '10px',
        backgroundColor: '#f9f9f9',
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
      React.createElement('h3', { key: 'title' }, 'React Hooks Debug Status'),
      React.createElement('div', { key: 'status' }, [
        React.createElement(
          'p',
          { key: 'state' },
          `✅ useState: ${state} - SUCCESS`
        ),
        React.createElement(
          'p',
          { key: 'ref' },
          `✅ useRef: ${refTest.current} - SUCCESS`
        ),
        React.createElement(
          'p',
          { key: 'effect' },
          `✅ useEffect: ${effectCount} calls - SUCCESS`
        ),
        React.createElement(
          'p',
          { key: 'layout' },
          `✅ useLayoutEffect: ${layoutEffectCount} calls - SUCCESS`
        ),
        React.createElement(
          'p',
          { key: 'memo' },
          `✅ useMemo: ${memoTest} - SUCCESS`
        )
      ]),
      React.createElement(
        'div',
        {
          key: 'react-info',
          style: { marginTop: '10px', fontSize: '12px', color: '#666' }
        },
        [
          React.createElement(
            'p',
            { key: 'version' },
            `React Version: ${React.version || 'Unknown'}`
          ),
          React.createElement(
            'p',
            { key: 'import' },
            'Import Method: namespace import (* as React)'
          ),
          React.createElement(
            'p',
            { key: 'method' },
            'Render Method: React.createElement (no JSX)'
          )
        ]
      )
    ]
  );
};

export default DebugReactImports;
