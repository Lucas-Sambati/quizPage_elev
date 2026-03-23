import { useLocation } from 'wouter'
import { ScreenContainer } from '@/components/ui/ScreenContainer'
import { CTAButton } from '@/components/ui/CTAButton'
import { analytics } from '@/lib/analytics'
import { useEffect } from 'react'
import { useQuiz } from '@/hooks/useQuiz'

/**
 * Tipos de perfil baseados nas respostas
 */
type ProfileType = 'TREINA_DEMAIS' | 'ESTAGNADO' | 'SEM_DIRECAO'

interface ProfileContent {
  profileTitle: string // Título do perfil (ex: PERFIL O TREINA MUITO)
  validation: string // Validação emocional
  errorTitle: string // Nome do erro principal
  subtitleBefore: string // Texto antes do traço (normal)
  subtitleHighlight: string // Texto depois do traço (destacado em primary)
  description: string // Explicação simples do erro
  secondaryDescription: string // Complemento da explicação
  consequence: string // Consequência futura (realista)
  solutionIntro: string // Introdução personalizada da solução
}

/**
 * Determina o perfil baseado nas respostas das perguntas 2 e 3
 */
function getProfile(trainingDays?: string, mainProblem?: string): ProfileType {
  // Pergunta 1 não é decisiva, apenas perguntas 2 (mainProblem) e 3 (trainingDays)
  
  const isHighFrequency = trainingDays === '5x ou mais' || trainingDays === '4x por semana'
  
  // TREINA DEMAIS: 5x+ ou 4x + "Treino muito e evoluo pouco"
  if (isHighFrequency && mainProblem === 'Treino muito e evoluo pouco') {
    return 'TREINA_DEMAIS'
  }
  
  // ESTAGNADO: 5x+ ou 4x + "Não consigo aumentar carga"
  if (isHighFrequency && mainProblem === 'Não consigo aumentar carga') {
    return 'ESTAGNADO'
  }
  
  // SEM DIREÇÃO: Todos os outros casos
  return 'SEM_DIRECAO'
}

/**
 * Conteúdo personalizado para cada perfil
 */
const PROFILE_CONTENT: Record<ProfileType, ProfileContent> = {
  TREINA_DEMAIS: {
    profileTitle: 'PERFIL O TREINA MUITO',
    validation: 'Esse é um dos perfis mais comuns entre quem treina e não vê resultado.',
    errorTitle: 'O Excesso de Volume',
    subtitleBefore: 'O erro do perfil Treina Demais não é falta de esforço — ', 
    subtitleHighlight: 'é excesso dele',
    description: 'Treinar 5x ou mais por semana com volume alto gera fadiga constante e impede a recuperação muscular adequada.',
    secondaryDescription: 'Seus músculos crescem no descanso, não no treino. Sem recuperação suficiente, você só acumula cansaço.',
    consequence: 'Se continuar assim, em alguns meses seu corpo vai estar praticamente igual.',
    solutionIntro: 'Esse plano é para quem se dedica, mas não vê retorno proporcional ao esforço.'
  },
  ESTAGNADO: {
    profileTitle: 'PERFIL O ESTAGNADO',
    validation: 'Esse é um dos perfis mais comuns entre quem treina e não vê resultado.',
    errorTitle: 'A Falta de Progressão',
    subtitleBefore: 'O erro do perfil Estagnado não é falta de esforço — ', 
    subtitleHighlight: 'é falta de planejamento',
    description: 'Treinar com frequência alta sem progredir nas cargas significa que seu corpo não está recebendo o estímulo certo para evoluir.',
    secondaryDescription: 'Músculo cresce quando você desafia ele com cargas progressivas. Se a carga não sobe, o músculo não tem motivo para crescer.',
    consequence: 'Se continuar assim, em alguns meses seu corpo vai estar praticamente igual.',
    solutionIntro: 'Pensando exatamente em quem está travado mesmo treinando, eu criei um plano simples para destravar resultados.'
  },
  SEM_DIRECAO: {
    profileTitle: 'PERFIL O SEM DIREÇÃO',
    validation: 'Esse é um dos perfis mais comuns entre quem treina e não vê resultado.',
    errorTitle: 'A Falta de Estratégia',
    subtitleBefore: 'O erro do perfil Sem Direção não é falta de esforço — ', 
    subtitleHighlight: 'é falta de estratégia',
    description: 'Treinar sem um plano claro e comer no automático faz você gastar energia sem retorno.',
    secondaryDescription: 'Sem saber o que você está fazendo e por quê, você fica refém do acaso. Um dia treina bem, outro nem tanto. Um dia come certo, outro não.',
    consequence: 'Se continuar assim, em alguns meses seu corpo vai estar praticamente igual.',
    solutionIntro: 'Esse plano é para quem quer parar de treinar no escuro e começar a ver resultado.'
  }
}

/**
 * TELA 3 - DIAGNÓSTICO PERSONALIZADO
 * 
 * Objetivo: gerar identificação + dor + urgência
 * Estrutura: validação emocional → nome do erro → explicação → consequência futura
 */
export function ResultScreen() {
  const [, setLocation] = useLocation()
  const { answers } = useQuiz()

  useEffect(() => {
    analytics.trackPageView('result')
  }, [])

  const profileType = getProfile(answers.trainingDays, answers.mainProblem)
  const content = PROFILE_CONTENT[profileType]

  const handleContinue = () => {
    analytics.trackCTAClick('result_screen')
    setLocation('/solucao')
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
            <span>Diagnóstico completo</span>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="flex-1 flex flex-col justify-center space-y-5 md:space-y-7 text-center px-4 max-w-2xl mx-auto w-full">
          {/* Título do perfil */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary uppercase tracking-wide">
            {content.profileTitle}
          </h2>

          {/* 1. Validação emocional */}
          <div className="bg-primary/5 rounded-lg p-4 md:p-5 border border-primary/20">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              {content.validation}
            </p>
          </div>

          {/* 2. Nome do erro principal */}
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              {content.errorTitle}
            </h3>
            
            <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">
              {content.subtitleBefore}<span className="text-primary">{content.subtitleHighlight}</span>
            </p>
          </div>

          {/* 3. Explicação simples do erro */}
          <div className="space-y-3 text-left">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-primary/10">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {content.description}
              </p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 md:p-5 border border-primary/10">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {content.secondaryDescription}
              </p>
            </div>
          </div>

          {/* 4. Consequência futura (realista) */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-4 md:p-5 border border-amber-500/20">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed font-medium">
              {content.consequence}
            </p>
          </div>

          {/* 5. Como corrigir isso - 3 pilares */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Como corrigir isso:
            </h3>
            
            <div className="space-y-3 text-left">
              {[
                'Um treino ajustado à sua rotina',
                'Um plano alimentar simples e sustentável',
                'Um método claro de progressão semanal'
              ].map((pilar, index) => (
                <div 
                  key={index} 
                  className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/10 flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-base md:text-lg text-foreground font-medium">
                    {pilar}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Introdução da solução personalizada */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-5 md:p-6 border border-primary/20">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {content.solutionIntro}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center space-y-2 md:space-y-3 pt-2 md:pt-4">
            <CTAButton 
              size="lg"
              onClick={handleContinue}
              className="w-full shadow-2xl shadow-primary/20 hover:shadow-primary/30"
            >
              Quero meu plano personalizado
            </CTAButton>
            <p className="text-xs text-muted-foreground">
              Próxima etapa: o que fazer a partir de agora
            </p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  )
}
