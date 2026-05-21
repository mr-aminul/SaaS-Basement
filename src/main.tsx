import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { NotificationsProvider } from '@/contexts/NotificationsContext'
import App from './App'
import { applyFavicon } from '@/lib/applyFavicon'
import './index.css'

applyFavicon()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>,
)
