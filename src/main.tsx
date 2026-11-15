import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA service worker for Chrome & Android installability across preview and production
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        // Automatically check for SW updates
        reg.update().catch(() => {});
      })
      .catch((err) => {
        console.log('SW registration note:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
