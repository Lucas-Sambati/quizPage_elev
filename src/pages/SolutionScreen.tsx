import { useLocation } from 'wouter'
import { ScreenContainer } from '@/components/ui/ScreenContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { analytics } from '@/lib/analytics'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useQuiz } from '@/hooks/useQuiz'

/**
 * ⚠️ CONFIGURAÇÃO IMPORTANTE
 * Substitua pela URL real do seu checkout Kiwify
 */
const CHECKOUT_URL = 'https://pay.kiwify.com.br/fUcu9RX'

/**
 * Tipos de perfil baseados nas respostas
 */
type ProfileType = 'TREINA_DEMAIS' | 'ESTAGNADO' | 'SEM_DIRECAO'

/**
 * Determina o perfil baseado nas respostas das perguntas 2 e 3
 */
function getProfile(trainingDays?: string, mainProblem?: string): ProfileType {
  const isHighFrequency = trainingDays === '5x ou mais' || trainingDays === '4x por semana'
  
  if (isHighFrequency && mainProblem === 'Treino muito e evoluo pouco') {
    return 'TREINA_DEMAIS'
  }
  
  if (isHighFrequency && mainProblem === 'Não consigo aumentar carga') {
    return 'ESTAGNADO'
  }
  
  return 'SEM_DIRECAO'
}

/**
 * Conteúdo personalizado para cada perfil
 */
interface ProfileSolutionContent {
  targetAudience: string // Para quem é
  profileName: string // Nome amigável do perfil
}

const PROFILE_SOLUTION: Record<ProfileType, ProfileSolutionContent> = {
  TREINA_DEMAIS: {
    targetAudience: 'Esse plano é para quem se identificou com o perfil Treina Muito.',
    profileName: 'Treina Muito'
  },
  ESTAGNADO: {
    targetAudience: 'Esse plano é para quem se identificou com o perfil Estagnado.',
    profileName: 'Estagnado'
  },
  SEM_DIRECAO: {
    targetAudience: 'Esse plano é para quem se identificou com o perfil Sem Direção.',
    profileName: 'Sem Direção'
  }
}

/**
 * TELA 4 - SOLUÇÃO + CTA
 * 
 * Apresenta a solução (produto)
 * Lista o que está incluído
 * Mostra preço e CTA final para checkout
 */
export function SolutionScreen() {
  const [, setLocation] = useLocation()
  const { answers } = useQuiz()
  const [sheetImageSrc, setSheetImageSrc] = useState(`${import.meta.env.BASE_URL}planilha.jpg`)

  useEffect(() => {
    analytics.trackPageView('solution')
    // Scroll para o topo ao entrar na página
    window.scrollTo(0, 0)
  }, [])

  const profileType = getProfile(answers.trainingDays, answers.mainProblem)
  const profileContent = PROFILE_SOLUTION[profileType]

  const handleCheckout = () => {
    analytics.trackCheckout()
    analytics.trackCTAClick('solution_screen_checkout')
    
    // Redireciona para checkout Kiwify
    window.location.href = CHECKOUT_URL
  }

  return (
    <ScreenContainer fullHeight>
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-primary/10 pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col justify-between py-8 md:py-12">
        {/* Topo com badge de credibilidade */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Solução personalizada</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-5 md:space-y-7 px-4 max-w-2xl mx-auto w-full">
          
          {/* 1. Para quem é */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              A solução para o seu caso
            </h1>
            <div className="bg-primary/5 rounded-lg p-4 md:p-5 border border-primary/20">
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                {profileContent.targetAudience}
              </p>
            </div>
          </div>

          {/* 2. O que a pessoa recebe */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center">
              O que você recebe:
            </h2>
            <div className="space-y-3 bg-background/80 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-primary/10">
              {[
                'Planilha de treino personalizada',
                'Plano alimentar simples',
                'Instruções de uso'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base md:text-lg text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. O que você vai perceber */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center">
              O que você vai perceber usando o plano
            </h2>
            <div className="space-y-3 bg-background/80 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-primary/10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base md:text-lg text-foreground font-semibold">Na primeira semana:</p>
                  <p className="text-base md:text-lg text-muted-foreground">Você entende exatamente o que fazer em cada treino</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base md:text-lg text-foreground font-semibold">Em 14 dias:</p>
                  <p className="text-base md:text-lg text-muted-foreground">Sente mais controle sobre alimentação e treino</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base md:text-lg text-foreground font-semibold">Em 30 dias:</p>
                  <p className="text-base md:text-lg text-muted-foreground">Começa a ver mudanças reais no corpo e na consistência</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3.5. Isso não é genérico */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-5 md:p-6 border-2 border-accent/20 space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-foreground text-center">
              Isso não é um PDF genérico
            </h3>
            <p className="text-base md:text-lg text-foreground/90 text-center leading-relaxed">
              O plano foi criado para quem se identificou com o perfil <span className="font-bold text-primary">{profileContent.profileName}</span>,
              com foco em simplicidade, execução e resultado real.
            </p>
          </div>

          {/* 4. Como usar */}
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-primary/10">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
              Como usar:
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Você segue o treino, ajusta a alimentação e acompanha a progressão semanal.
            </p>
          </div>

          {/* 5. Prova visual */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-center text-muted-foreground">
              Print da planilha:
            </p>
            <div className="relative overflow-hidden rounded-lg border border-primary/15 bg-background">
              <img
                src={sheetImageSrc}
                alt="Print da planilha com progressão automática"
                className="w-full h-auto block"
                onError={() => {
                  if (sheetImageSrc.includes('.jpg')) setSheetImageSrc(`${import.meta.env.BASE_URL}planilha.jpg`)
                }}
              />
            </div>
          </div>

          {/* 6. Garantia */}
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-primary/10 text-center space-y-2">
            <p className="text-base md:text-lg text-foreground font-semibold">
              7 dias de garantia incondicional
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              Se não fizer sentido pra você, é só pedir o reembolso.
            </p>
          </div>

          {/* 7. Preço */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-5 md:p-6 border-2 border-primary/20 text-center space-y-3">
            <p className="text-muted-foreground text-sm font-medium">
              Acesso completo por apenas
            </p>
            <div className="space-y-1">
              <div className="text-5xl md:text-6xl font-bold text-primary">
                R$ 19,90
              </div>
              <p className="text-sm text-muted-foreground">
                pagamento único • sem mensalidades
              </p>
            </div>
          </div>

          {/* 7.5. Micro-FAQ */}
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-primary/10 space-y-4">
            <div className="space-y-2">
              <p className="text-base md:text-lg font-bold text-foreground flex items-start gap-2">
                <span className="text-primary">❓</span>
                <span>Isso serve pra iniciantes?</span>
              </p>
              <p className="text-sm md:text-base text-muted-foreground pl-7">
                Sim, o plano é simples e guiado.
              </p>
            </div>
            
            <div className="h-px bg-primary/10" />
            
            <div className="space-y-2">
              <p className="text-base md:text-lg font-bold text-foreground flex items-start gap-2">
                <span className="text-primary">❓</span>
                <span>Preciso seguir dieta rígida?</span>
              </p>
              <p className="text-sm md:text-base text-muted-foreground pl-7">
                Não. A ideia é adaptação, não radicalismo.
              </p>
            </div>
            
            <div className="h-px bg-primary/10" />
            
            <div className="space-y-2">
              <p className="text-base md:text-lg font-bold text-foreground flex items-start gap-2">
                <span className="text-primary">❓</span>
                <span>Como recebo o acesso?</span>
              </p>
              <p className="text-sm md:text-base text-muted-foreground pl-7">
                Acesso imediato após o pagamento.
              </p>
            </div>
          </div>

          {/* 8. CTA final */}
          <div className="space-y-3">
            <CTAButton 
              size="lg"
              onClick={handleCheckout}
              className="w-full shadow-2xl shadow-primary/20 hover:shadow-primary/30"
            >
              Quero acessar agora
            </CTAButton>
            
            {/* Badges de segurança */}
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Pagamento seguro</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Recebe por e-mail</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Acesso imediato</span>
              </div>
            </div>
          </div>

        </div>

        {/* Botão voltar na parte inferior */}
        <div className="text-center mt-6 px-4">
          <button
            onClick={() => setLocation('/resultado')}
            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </ScreenContainer>
  )
}
