// Ensure window.fetch has both getter and setter to prevent "Cannot set property fetch of #<Window> which has only a getter"
if (typeof window !== 'undefined' && window.fetch) {
  try {
    let _fetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get() { return _fetch; },
      set(fn) { _fetch = fn; }
    });
  } catch (_e) {
    // Ignore if already defined
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
