import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { shelfStore } from '@/store'
import App from './App.tsx'
import './index.css'

void shelfStore.start()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
