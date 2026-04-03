import { useEffect, useState, useRef } from "react";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Lightbulb } from "lucide-react";

interface LoadingAnalysisProps {
  onComplete: () => void;
  videoUrl?: string;
}

/** Tempo mínimo de exibição (ms) para manter a sensação de análise real */
const MIN_DISPLAY_MS = 2000;
/** Tempo máximo de espera pelo vídeo (ms) — fallback para redes lentas */
const MAX_WAIT_MS = 12000;

/**
 * Tela de transição com análise por IA
 * Pré-carrega o vídeo da VSL enquanto mostra animação
 */
export function LoadingAnalysis({
  onComplete,
  videoUrl,
}: LoadingAnalysisProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const completedRef = useRef(false);

  const messages = [
    "Analisando suas respostas...",
    "Identificando seu perfil...",
    "Preparando seu diagnóstico personalizado...",
  ];

  useEffect(() => {
    const startTime = Date.now();
    let videoReady = !videoUrl; // se não há URL, já está "pronto"

    // Baixa o vídeo completamente via fetch para popular o cache do browser
    const controller = new AbortController();
    if (videoUrl) {
      fetch(videoUrl, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error("fetch failed");
          return res.blob();
        })
        .then(() => {
          videoReady = true;
          tryComplete();
        })
        .catch(() => {
          // Em caso de erro (rede, abort), não bloqueia
          videoReady = true;
          tryComplete();
        });
    }

    // Timeout máximo — nunca bloquear o usuário por muito tempo
    const maxTimer = setTimeout(() => {
      videoReady = true;
      tryComplete();
    }, MAX_WAIT_MS);

    // Timer mínimo de exibição
    let minElapsed = false;
    const minTimer = setTimeout(() => {
      minElapsed = true;
      tryComplete();
    }, MIN_DISPLAY_MS);

    function tryComplete() {
      if (completedRef.current) return;
      if (minElapsed && videoReady) {
        completedRef.current = true;
        setProgress(100);
        // Pequeno delay para o usuário ver 100%
        setTimeout(() => onComplete(), 200);
      }
    }

    // Progresso visual animado
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95; // para em 95% até vídeo estar pronto
        }
        // Acelera no início, desacelera no final
        const elapsed = Date.now() - startTime;
        const target = Math.min(95, (elapsed / MIN_DISPLAY_MS) * 90);
        return Math.max(prev, target);
      });
    }, 50);

    // Mudança de mensagens
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % 3);
    }, 600);

    return () => {
      controller.abort();
      clearTimeout(maxTimer);
      clearTimeout(minTimer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete, videoUrl]);

  return (
    <ScreenContainer fullHeight>
      {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background pointer-events-none animate-pulse" />

      <div className="relative flex-1 flex flex-col justify-center items-center px-4 space-y-8">
        {/* Ícone de IA animado */}
        <div className="relative">
          {/* Círculos pulsantes ao fundo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary/20 rounded-full animate-ping" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/30 rounded-full animate-pulse" />
          </div>

          {/* Ícone central */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 animate-bounce">
            <svg
              className="w-10 h-10 text-white animate-spin"
              style={{ animationDuration: "3s" }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>

        {/* Texto animado */}
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground inline-flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" /> Analisando...
          </h2>

          {/* Mensagem que muda */}
          <p className="text-base md:text-lg text-muted-foreground min-h-[2em] transition-all duration-300">
            {messages[messageIndex]}
          </p>
        </div>

        {/* Barra de progresso animada */}
        <div className="w-full max-w-md space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {progress}%
          </p>
        </div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}
