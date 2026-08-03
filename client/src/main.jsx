import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{BrowserRouter} from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import {MotionConfig} from 'motion/react';

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <MotionConfig viewport={{ once: true }}>
          <App />
        </MotionConfig>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
