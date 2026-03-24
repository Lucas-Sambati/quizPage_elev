import { useState, createContext, useContext, ReactNode } from "react";

/**
 * Estado e respostas do Quiz
 */
export interface QuizAnswers {
  gymFrequency?: string; // Q1: frequência semanal na academia
  lowFreqReason?: string; // Q2 (freq=2-): motivo da baixa frequência
  trainingSchedule?: string; // Q3 (falta de tempo): horário preferido
  gymDuration?: string; // Q4 (falta de tempo): duração na academia
  motivationFactor?: string; // Q3 (pouca motivação): fator motivacional
  confusionReason?: string; // Q3 (não sei o que fazer): fonte de confusão
  currentGoal?: string; // Q2 (freq=3à4/5+): objetivo atual
  stagnationReason?: string; // Q3 (estagnado): causa da estagnação
  changeDesire?: string; // Q3 (mudança): tipo de mudança desejada
  healthArea?: string; // Q3 (saúde): área de saúde afetada
  finalObjective?: string; // Última pergunta: objetivo principal
}

interface QuizContextType {
  answers: QuizAnswers;
  setAnswer: (key: keyof QuizAnswers, value: string) => void;
  resetAnswers: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const setAnswer = (key: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAnswers = () => {
    setAnswers({});
  };

  return (
    <QuizContext.Provider value={{ answers, setAnswer, resetAnswers }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
}
