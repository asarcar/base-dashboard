// src/debug/DebugUtils.tsx
import * as React from 'react';
import * as RRD from 'react-router-dom';
import { useEffect } from 'react';

// Bundle Analyzer Component
export const BundleAnalyzer: React.FC = () => {
  if (getDebugMode() === false) return null;

  const [analysis, setAnalysis] = React.useState<string>('Analyzing...');

  React.useEffect(() => {
    // Analyze the runtime React instances
    const reactInstances = [];

    // Check if we have multiple React instances
    if (typeof window !== 'undefined') {
      // Check global React
      if (window.react) {
        reactInstances.push('window.React found');
      }

      // Check current React instance
      reactInstances.push(`Current React version: ${React.version}`);

      // Check for React DevTools
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
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

// Enhanced debugging to isolate the exact issue
export const DebugReactImports: React.FC = () => {
  if (getDebugMode() === false) return null;

  // Test all the hooks that were causing issues
  const [state] = React.useState('initialized');
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

// Example Usage: <ValidateReact name="SignInPage" />
export function ValidateReact({ name }: { name: string }) {
  if (getDebugMode() === false) return null;

  const ctx = React.useContext(RRD.UNSAFE_NavigationContext);
  if (ctx == null) {
    console.warn(
      `[${name}] ❌ UNSAFE_NavigationContext is null - called outside BrowserRoute?`
    );
    return null;
  }

  useEffect(() => {
    try {
      validatorOfReactIDs(name, React, RRD);
      console.log(`[${name}] ✅ NavigationContext:`, ctx);
    } catch (e) {
      console.error(`[${name}] ❌ Context validation failed:`, e);
    }
  }, []);

  return null;
}

export function ValidateReactIDs(
  name: string,
  react: typeof React,
  rrd: typeof RRD
) {
  if (getDebugMode() === false) return null;

  try {
    validatorOfReactIDs(name, react, rrd);
  } catch (e) {
    console.error(`[${name}] Identity validation failed:`, e);
  }
}

function validatorOfReactIDs(
  name: string,
  react: typeof React,
  rrd: typeof RRD
) {
  console.log(`[${name}] React version:`, react.version);
  console.log(`[${name}] React identity:`, react);
  // window.react, window.reactRouterDom is a debug only injection
  // hence added src/global.d.tsx to avoid (window as any)
  console.log(`[${name}] react === window.react?`, react === window.react);
  console.log(
    `[${name}] react-router-dom === window.reactRouterDom?`,
    rrd === window.reactRouterDom
  );
}

// DEBUG validation: only in effect in DEV/TEST mode
function getDebugMode(): boolean {
  return process.env.NODE_ENV !== 'production';
}
