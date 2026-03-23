import { useState, createContext, useContext, ReactNode } from 'react'

/**
 * Estado e respostas do Quiz
 */
export interface QuizAnswers {
  timeTraining?: string
  mainProblem?: string
  trainingDays?: string
}

interface QuizContextType {
  answers: QuizAnswers
  setAnswer: (key: keyof QuizAnswers, value: string) => void
  resetAnswers: () => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const setAnswer = (key: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const resetAnswers = () => {
    setAnswers({})
  }

  return (
    <QuizContext.Provider value={{ answers, setAnswer, resetAnswers }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider')
  }
  return context
}
