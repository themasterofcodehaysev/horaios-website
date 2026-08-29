import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppRoot';

function render(): void {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
}

render();

export default render;
