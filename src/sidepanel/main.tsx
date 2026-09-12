import './index.css';

import App from './App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { shelfStore } from '@/store';

void shelfStore.start();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
