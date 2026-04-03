import { useLocation, useParams } from "wouter";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { QuizOption } from "@/components/ui/QuizOption";
import { ProgressBar } from "@/components/ProgressBar";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { useQuiz, QuizAnswers } from "@/hooks/useQuiz";
import { getProfile, getVideoUrl } from "@/pages/ResultScreen";
import { analytics } from "@/lib/analytics";
import { useEffect, useRef, useState } from "react";
import {
  Dumbbell,
  HelpCircle,
  Target,
  Clock,
  Flame,
  Heart,
  Timer,
  Trophy,
  ClipboardList,
  ArrowUp,
} from "lucide-react";

/** Mapa de ícone por key da pergunta */
const QUESTION_ICONS: Record<string, React.ReactNode> = {
  gymFrequency: <Dumbbell className="w-7 h-7 text-primary" />,
  lowFreqReason: <HelpCircle className="w-7 h-7 text-primary" />,
  currentGoal: <Target className="w-7 h-7 text-primary" />,
  trainingSchedule: <Clock className="w-7 h-7 text-primary" />,
  motivationFactor: <Flame className="w-7 h-7 text-primary" />,
  confusionReason: <HelpCircle className="w-7 h-7 text-primary" />,
  stagnationReason: <ArrowUp className="w-7 h-7 text-primary" />,
  changeDesire: <Target className="w-7 h-7 text-primary" />,
  healthArea: <Heart className="w-7 h-7 text-primary" />,
  gymDuration: <Timer className="w-7 h-7 text-primary" />,
  finalObjective: <Trophy className="w-7 h-7 text-primary" />,
};

interface QuizQuestion {
  question: string;
  key: keyof QuizAnswers;
  options: string[];
  icon: string;
}

/**
 * Determina a pergunta a exibir no step atual com base
 * nas respostas anteriores armazenadas no contexto.
 */
function getQuestionForStep(
  step: number,
  answers: QuizAnswers,
): QuizQuestion | null {
  if (step === 1) {
    return {
      question: "Quantas vezes você vai à academia?",
      key: "gymFrequency",
      options: ["2 ou menos", "3 à 4 vezes", "5 ou mais"],
      icon: "gym",
    };
  }

  if (!answers.gymFrequency) return null;

  if (step === 2) {
    if (answers.gymFrequency === "2 ou menos") {
      return {
        question:
          "Por qual motivo você não consegue manter uma frequência maior?",
        key: "lowFreqReason",
        options: ["Falta de tempo", "Pouca motivação", "Não sei o que fazer"],
        icon: "reason",
      };
    }
    return {
      question: "Qual seu objetivo atual?",
      key: "currentGoal",
      options: [
        "Me sinto estagnado e quero voltar a evoluir",
        "Quero uma mudança no planejamento dos treinos",
        "Quero melhorar minha saúde",
      ],
      icon: "goal",
    };
  }

  if (!answers.lowFreqReason && !answers.currentGoal) return null;

  if (step === 3) {
    if (answers.lowFreqReason === "Falta de tempo") {
      return {
        question: "Qual horário de treino se encaixaria melhor na sua rotina?",
        key: "trainingSchedule",
        options: ["Manhã", "Tarde", "Noite"],
        icon: "schedule",
      };
    }
    if (answers.lowFreqReason === "Pouca motivação") {
      return {
        question: "O que mais te motivaria a continuar treinando?",
        key: "motivationFactor",
        options: [
          "Competição",
          "Perceber evoluções no seu físico",
          "Cobrança/acompanhamento individual",
        ],
        icon: "motivation",
      };
    }
    if (answers.lowFreqReason === "Não sei o que fazer") {
      return {
        question: "O que te deixa mais perdido?",
        key: "confusionReason",
        options: [
          "Não sei qual dieta seguir",
          "Vejo vários treinos diferentes e não sei qual seguir",
          "Falta de demonstração/explicação dos exercícios",
        ],
        icon: "confusion",
      };
    }
    if (answers.currentGoal === "Me sinto estagnado e quero voltar a evoluir") {
      return {
        question: "Por que você acha que está estagnado?",
        key: "stagnationReason",
        options: [
          "Sinto que meu treino/dieta não funcionam",
          "Meu físico não evolui",
          "Minha rotina não se encaixa mais no meu objetivo",
        ],
        icon: "stagnation",
      };
    }
    if (
      answers.currentGoal === "Quero uma mudança no planejamento dos treinos"
    ) {
      return {
        question: "O que você busca com essa mudança?",
        key: "changeDesire",
        options: [
          "Quero um treino mais dinâmico",
          "Quero um acompanhamento individual e personalizado",
          "Quero um treino mais flexível",
        ],
        icon: "change",
      };
    }
    if (answers.currentGoal === "Quero melhorar minha saúde") {
      return {
        question: "Em qual área você sente que mais te afeta?",
        key: "healthArea",
        options: [
          "Articulações e desgastes físicos",
          "Alterações no exame de sangue (colesterol, triglicérides, etc.)",
          "Mental (sono, ansiedade e humor)",
        ],
        icon: "health",
      };
    }
    return null;
  }

  if (step === 4) {
    // Caminho "Falta de tempo": Q4 é duração na academia
    if (answers.lowFreqReason === "Falta de tempo") {
      if (!answers.trainingSchedule) return null;
      return {
        question: "Quanto tempo você conseguiria ficar na academia?",
        key: "gymDuration",
        options: [
          "Menos de uma hora",
          "Aproximadamente uma hora",
          "Mais de uma hora e meia",
        ],
        icon: "duration",
      };
    }
    // Todos os outros caminhos: Q4 é o objetivo final
    return {
      question: "Qual objetivo você busca?",
      key: "finalObjective",
      options: ["Ganhar Músculos", "Perder Peso", "Aumentar Força"],
      icon: "objective",
    };
  }

  if (step === 5) {
    // Somente alcançado no caminho "Falta de tempo"
    if (answers.lowFreqReason === "Falta de tempo" && answers.gymDuration) {
      return {
        question: "Qual objetivo você busca?",
        key: "finalObjective",
        options: ["Ganhar Músculos", "Perder Peso", "Aumentar Força"],
        icon: "objective",
      };
    }
    return null;
  }

  return null;
}

function getMaxSteps(answers: QuizAnswers): number {
  return answers.lowFreqReason === "Falta de tempo" ? 5 : 4;
}

/**
 * TELA 2 - QUIZ INTERATIVO
 *
 * Mostra 1 pergunta por vez com fluxo condicional.
 * A pergunta exibida depende das respostas anteriores.
 * Barra de progresso no topo.
 */
export function QuizScreen() {
  const params = useParams<{ step: string }>();
  const [, setLocation] = useLocation();
  const { answers, setAnswer } = useQuiz();
  const [showLoading, setShowLoading] = useState(false);
  const prefetchedRef = useRef(false);

  const step = parseInt(params.step || "1");

  // Se está além do step 1 sem resposta inicial, redireciona
  if (step > 1 && !answers.gymFrequency) {
    setLocation("/quiz/1");
    return null;
  }

  const currentQuiz = getQuestionForStep(step, answers);
  const maxSteps = getMaxSteps(answers);
  const progress = (step / maxSteps) * 100;

  useEffect(() => {
    analytics.trackPageView(`quiz_step_${step}`);
  }, [step]);

  // Redireciona se step inválido ou estado inconsistente
  if (!currentQuiz || step < 1 || step > 5) {
    setLocation("/quiz/1");
    return null;
  }

  const handleAnswer = (answer: string) => {
    setAnswer(currentQuiz.key, answer);
    analytics.trackQuizStep(step, answer);

    // Prefetch: na penúltima pergunta já sabemos o perfil (finalObjective não altera o resultado).
    // Projetamos as respostas incluindo a atual e determinamos o vídeo para começar o download.
    const isPenultimate = step === maxSteps - 1;
    if (isPenultimate && !prefetchedRef.current) {
      prefetchedRef.current = true;
      try {
        const projected = { ...answers, [currentQuiz.key]: answer };
        const profile = getProfile(projected);
        const videoUrl = getVideoUrl(profile);
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = videoUrl;
        link.type = "video/mp4";
        document.head.appendChild(link);
      } catch {
        // silently ignore — prefetch is best-effort
      }
    }

    if (currentQuiz.key === "finalObjective") {
      analytics.trackQuizComplete();
      setShowLoading(true);
    } else {
      setLocation(`/quiz/${step + 1}`);
    }
  };

  const handleLoadingComplete = () => {
    setLocation("/resultado");
  };

  if (showLoading) {
    // Calcula a URL do vídeo do perfil para pré-carregar durante a análise
    const profile = getProfile(answers);
    const videoUrlToPreload = getVideoUrl(profile);
    return (
      <LoadingAnalysis
        onComplete={handleLoadingComplete}
        videoUrl={videoUrlToPreload}
      />
    );
  }

  return (
    <ScreenContainer fullHeight>
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative flex-1 flex flex-col py-6 px-4">
        {/* Cabeçalho com progresso */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-primary inline-flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" /> Diagnóstico
            </span>
            <span className="text-muted-foreground">
              Etapa {step} de {maxSteps}
            </span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Pergunta - centralizada verticalmente */}
        <div className="flex-1 flex flex-col justify-center space-y-8 max-w-xl mx-auto w-full">
          {/* Ícone da pergunta */}
          <div className="flex justify-center animate-fade-in-up">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              {QUESTION_ICONS[currentQuiz.key] ?? (
                <Target className="w-7 h-7 text-primary" />
              )}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center leading-tight">
            {currentQuiz.question}
          </h2>

          {/* Opções */}
          <div className="space-y-3 stagger">
            {currentQuiz.options.map((option, index) => (
              <QuizOption
                key={index}
                text={option}
                onClick={() => handleAnswer(option)}
              />
            ))}
          </div>

          {/* Indicador de progresso visual */}
          <div className="text-center text-sm text-muted-foreground inline-flex items-center justify-center gap-1.5 w-full">
            <ArrowUp className="w-3.5 h-3.5" />
            {currentQuiz.key !== "finalObjective"
              ? "Escolha uma opção para continuar"
              : "Última pergunta!"}
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
