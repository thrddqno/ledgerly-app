import { StrictMode } from 'react'
import './app/index.css'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
