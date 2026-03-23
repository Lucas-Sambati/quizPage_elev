import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Processa redirecionamento do 404.html
;(function() {
  const redirect = sessionStorage.redirect
  delete sessionStorage.redirect
  if (redirect && redirect !== location.href) {
    const base = import.meta.env.BASE_URL || '/'
    const path = redirect.replace(location.origin + base, '/')
    if (path !== '/') {
      history.replaceState(null, '', base + path.slice(1))
    }
  }
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
