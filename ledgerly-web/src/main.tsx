import { StrictMode } from 'react'
import './app/index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './app/App.tsx'
import AppProviders from './providers/AppProviders.tsx'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

const queryClient = new QueryClient()
const saved = localStorage.getItem('theme') ?? 'dark'
document.documentElement.setAttribute('data-theme', saved)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AppProviders>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </AppProviders>
        </BrowserRouter>
    </StrictMode>
)
