/**
 * Analytics helper
 * 
 * Adicione aqui integrações com:
 * - Microsoft Clarity
 * - Meta Pixel
 * - Google Analytics
 * - Tag Manager
 * 
 * Eventos importantes para trackear:
 * - page_view (cada tela do funil)
 * - quiz_started
 * - quiz_step_completed
 * - quiz_completed
 * - cta_clicked
 * - checkout_initiated
 */

// Declaração de tipos para o Clarity
declare global {
  interface Window {
    clarity?: (command: string, ...args: any[]) => void;
    gtag?: (command: string, ...args: any[]) => void;
  }
}

export const analytics = {
  // Exemplo de estrutura para tracking
  trackPageView: (pageName: string) => {
    console.log('📊 Page View:', pageName)
    
    // Microsoft Clarity - Tags customizadas
    if (window.clarity) {
      window.clarity('set', 'page', pageName)
    }
    
    // window.gtag?.('event', 'page_view', { page_name: pageName })
    // window.fbq?.('track', 'PageView')
  },

  trackEvent: (eventName: string, params?: Record<string, any>) => {
    console.log('📊 Event:', eventName, params)
    
    // Microsoft Clarity - Eventos customizados
    if (window.clarity) {
      window.clarity('event', eventName)
    }
    
    // window.gtag?.('event', eventName, params)
    // window.fbq?.('track', eventName, params)
  },

  trackQuizStart: () => {
    console.log('📊 Quiz Started')
    
    // Tag customizada no Clarity para segmentar sessões
    if (window.clarity) {
      window.clarity('set', 'quiz_status', 'started')
    }
    
    analytics.trackEvent('quiz_started')
  },

  trackQuizStep: (step: number, answer: string) => {
    console.log('📊 Quiz Step:', step, answer)
    
    // Rastrear progresso no funil
    if (window.clarity) {
      window.clarity('set', 'quiz_step', step.toString())
      window.clarity('set', `step_${step}_answer`, answer)
    }
    
    analytics.trackEvent('quiz_step_completed', { step, answer })
  },

  trackQuizComplete: () => {
    console.log('📊 Quiz Completed')
    
    // Marcar sessões que completaram o quiz
    if (window.clarity) {
      window.clarity('set', 'quiz_status', 'completed')
      window.clarity('event', 'quiz_completed')
    }
    
    analytics.trackEvent('quiz_completed')
  },

  trackCTAClick: (location: string) => {
    console.log('📊 CTA Clicked:', location)
    
    // Rastrear cliques em CTAs
    if (window.clarity) {
      window.clarity('event', `cta_clicked_${location}`)
    }
    
    analytics.trackEvent('cta_clicked', { location })
  },

  trackCheckout: () => {
    console.log('📊 Checkout Initiated')
    
    // Identificar sessões de alta intenção
    if (window.clarity) {
      window.clarity('set', 'conversion_intent', 'high')
      window.clarity('event', 'checkout_initiated')
    }
    
    analytics.trackEvent('checkout_initiated')
  },

  // Identificar usuários (caso tenha email/ID)
  identifyUser: (userId: string, userEmail?: string) => {
    if (window.clarity) {
      window.clarity('identify', userId, undefined, undefined, userEmail)
    }
  },

  // Adicionar tags customizadas para segmentação
  setCustomTag: (key: string, value: string) => {
    if (window.clarity) {
      window.clarity('set', key, value)
    }
  }
}
