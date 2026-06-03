// Suppress specific console warnings
// This file should be imported at the very top of components that use Ant Design Collapse

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('[rc-collapse]')) {
    return;
  }
  originalWarn.apply(console, args);
};

export {};
