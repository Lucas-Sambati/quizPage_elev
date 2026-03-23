import { useLocation, useParams } from 'wouter'
import { ScreenContainer } from '@/components/ui/ScreenContainer'
import { QuizOption } from '@/components/ui/QuizOption'
import { ProgressBar } from '@/components/ProgressBar'
import { LoadingAnalysis } from '@/components/LoadingAnalysis'
import { useQuiz } from '@/hooks/useQuiz'
import { analytics } from '@/lib/analytics'
import { useEffect, useState } from 'react'

/**
 * Perguntas e opções do Quiz
 */
const QUIZ_DATA = [
  {
    id: 1,
    question: 'Há quanto tempo você treina?',
    key: 'timeTraining' as const,
    options: [
      'Menos de 6 meses',
      'Entre 6 meses e 2 anos',
      'Mais de 2 anos e estou estagnado'
    ]
  },
  {
    id: 2,
    question: 'O que mais te incomoda hoje no treino?',
    key: 'mainProblem' as const,
    options: [
      'Não consigo aumentar carga',
      'Treino muito e evoluo pouco',
      'Não sei se meu treino faz sentido',
      'Resultados travaram faz meses'
    ]
  },
  {
    id: 3,
    question: 'Quantos dias por semana você treina?',
    key: 'trainingDays' as const,
    options: [
      '3x ou menos',
      '4x por semana',
      '5x ou mais'
    ]
  }
]

/**
 * TELA 2 - QUIZ INTERATIVO
 * 
 * Mostra 1 pergunta por vez
 * Avança automaticamente ao clicar
 * Barra de progresso no topo
 */
export function QuizScreen() {
  const params = useParams<{ step: string }>()
  const [, setLocation] = useLocation()
  const { setAnswer } = useQuiz()
  const [showLoading, setShowLoading] = useState(false)

  const step = parseInt(params.step || '1')
  const currentQuiz = QUIZ_DATA.find(q => q.id === step)
  const progress = (step / 3) * 100

  useEffect(() => {
    analytics.trackPageView(`quiz_step_${step}`)
  }, [step])

  // Redirect se step inválido
  if (!currentQuiz || step < 1 || step > 3) {
    setLocation('/quiz/1')
    return null
  }

  const handleAnswer = (answer: string) => {
    // Salva resposta
    setAnswer(currentQuiz.key, answer)
    analytics.trackQuizStep(step, answer)

    // Avança para próxima etapa
    if (step < 3) {
      setLocation(`/quiz/${step + 1}`)
    } else {
      // Quiz completo - mostra tela de loading antes de ir para resultado
      analytics.trackQuizComplete()
      setShowLoading(true)
    }
  }

  const handleLoadingComplete = () => {
    setLocation('/resultado')
  }

  // Se está mostrando loading, renderiza a tela de análise
  if (showLoading) {
    return <LoadingAnalysis onComplete={handleLoadingComplete} />
  }

  return (
    <ScreenContainer fullHeight>
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col py-6 px-4">
        {/* Cabeçalho com progresso */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-primary">📋 Diagnóstico</span>
            <span className="text-muted-foreground">Etapa {step} de 3</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Pergunta - centralizada verticalmente */}
        <div className="flex-1 flex flex-col justify-center space-y-8 max-w-xl mx-auto w-full">
          {/* Ícone da pergunta */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">
                {step === 1 ? '⏱️' : step === 2 ? '🎯' : '📅'}
              </span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center leading-tight">
            {currentQuiz.question}
          </h2>

          {/* Opções */}
          <div className="space-y-3">
            {currentQuiz.options.map((option, index) => (
              <QuizOption
                key={index}
                text={option}
                onClick={() => handleAnswer(option)}
              />
            ))}
          </div>

          {/* Indicador de progresso visual */}
          <div className="text-center text-sm text-muted-foreground">
            {step < 3 ? '👆 Escolha uma opção para continuar' : '👆 Última pergunta!'}
          </div>
        </div>
      </div>
    </ScreenContainer>
  )
}
