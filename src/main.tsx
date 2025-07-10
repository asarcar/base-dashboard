// src/main.tsx
import * as React from 'react';
import * as ReactDOMC from 'react-dom/client';
import * as RRD from 'react-router-dom';
import App from '@/App.tsx';
import '@/index.css'; // Import global styles
import { DebugReactImports, BundleAnalyzer } from '@/debug/DebugUtils';
import { ValidateReactIDs } from '@/debug/DebugUtils';

ValidateReactIDs('main-TOP', React, RRD);

const root = ReactDOMC.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <DebugReactImports />
    <BundleAnalyzer />
    <App />
  </React.StrictMode>
);
