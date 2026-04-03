import { useLocation } from "wouter";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { CTAButton } from "@/components/ui/CTAButton";
import { analytics } from "@/lib/analytics";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuiz, QuizAnswers } from "@/hooks/useQuiz";

/**
 * Curva de easing para a barra de progresso da VSL.
 * Faz a barra avançar rápido no início e desacelerar perto do fim,
 * mas sempre terminar em 100% junto com o vídeo.
 *
 * Math.pow(x, 0.35) → ex: 10% real ≈ 45% visual, 50% real ≈ 80% visual
 */
function easeProgress(real: number): number {
  return Math.pow(Math.min(Math.max(real, 0), 1), 0.45);
}

/**
 * Tipos de perfil baseados nas respostas
 */
type ProfileType =
  | "OCUPADO"
  | "DESALINHADO"
  | "OBSTINADO"
  | "PROGRESSIVO"
  | "REATIVO"
  | "SEM_DIRECAO"
  | "BLOQUEADO"
  | "ENERGICO"
  | "EXIGENTE"
  | "MALEAVAL"
  | "LONGEVIDADE";

interface ProfileContent {
  profileTitle: string;
  profileName: string;
}

/**
 * Determina o perfil com base no caminho percorrido no quiz
 */
function getProfile(answers: QuizAnswers): ProfileType {
  const {
    gymFrequency,
    lowFreqReason,
    gymDuration,
    motivationFactor,
    currentGoal,
    stagnationReason,
    changeDesire,
  } = answers;

  if (gymFrequency === "2 ou menos") {
    if (lowFreqReason === "Falta de tempo") {
      if (gymDuration === "Menos de uma hora") return "OCUPADO";
      return "DESALINHADO";
    }
    if (lowFreqReason === "Pouca motivação") {
      if (motivationFactor === "Competição") return "OBSTINADO";
      if (motivationFactor === "Perceber evoluções no seu físico")
        return "PROGRESSIVO";
      return "REATIVO";
    }
    return "SEM_DIRECAO";
  }

  // 3 à 4 vezes ou 5 ou mais
  if (currentGoal === "Me sinto estagnado e quero voltar a evoluir") {
    if (stagnationReason === "Minha rotina não se encaixa mais no meu objetivo")
      return "DESALINHADO";
    return "BLOQUEADO";
  }
  if (currentGoal === "Quero uma mudança no planejamento dos treinos") {
    if (changeDesire === "Quero um treino mais dinâmico") return "ENERGICO";
    if (changeDesire === "Quero um acompanhamento individual e personalizado")
      return "EXIGENTE";
    return "MALEAVAL";
  }
  return "LONGEVIDADE";
}

/**
 * Conteúdo base compartilhado por todos os perfis
 */
const BASE_CONTENT = {};

/**
 * Conteúdo personalizado para cada perfil
 */
const PROFILE_CONTENT: Record<ProfileType, ProfileContent> = {
  OCUPADO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL OCUPADO",
    profileName: "OCUPADO",
  },
  DESALINHADO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL DESALINHADO",
    profileName: "DESALINHADO",
  },
  OBSTINADO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL OBSTINADO",
    profileName: "OBSTINADO",
  },
  PROGRESSIVO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL PROGRESSIVO",
    profileName: "PROGRESSIVO",
  },
  REATIVO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL REATIVO",
    profileName: "REATIVO",
  },
  SEM_DIRECAO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL SEM DIREÇÃO",
    profileName: "SEM DIREÇÃO",
  },
  BLOQUEADO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL BLOQUEADO",
    profileName: "BLOQUEADO",
  },
  ENERGICO: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL ENÉRGICO",
    profileName: "ENÉRGICO",
  },
  EXIGENTE: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL EXIGENTE",
    profileName: "EXIGENTE",
  },
  MALEAVAL: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL MALEÁVEL",
    profileName: "MALEÁVEL",
  },
  LONGEVIDADE: {
    ...BASE_CONTENT,
    profileTitle: "PERFIL LONGEVIDADE",
    profileName: "LONGEVIDADE",
  },
};

/**
 * URL base do bucket R2 público (Cloudflare)
 */
const R2_BASE_URL = "https://pub-5121bd5b7ba549e98a3f6c16f65c1928.r2.dev";

/**
 * Mapeamento hardcoded: perfil → nome do arquivo de vídeo no bucket R2.
 * Altere os valores aqui caso os nomes dos objetos mudem.
 */
const PROFILE_VIDEO_MAP: Record<ProfileType, string> = {
  OCUPADO: "VSL OCUPADO",
  DESALINHADO: "VSL DESALINHADO",
  OBSTINADO: "VSL OBSTINADO",
  PROGRESSIVO: "VSL PROGRESSIVO",
  REATIVO: "VSL REATIVO",
  SEM_DIRECAO: "VSL SEM DIRECAO",
  BLOQUEADO: "VSL BLOQUEADO",
  ENERGICO: "VSL ENERGICO",
  EXIGENTE: "VSL EXIGENTE",
  MALEAVAL: "VSL MALEAVAL",
  LONGEVIDADE: "VSL LONGEVIDADE",
};

export function getVideoUrl(profile: ProfileType): string {
  const objectKey = PROFILE_VIDEO_MAP[profile];
  return `${R2_BASE_URL}/${encodeURIComponent(objectKey)}.mp4`;
}

export { getProfile, type ProfileType };

/**
 * TELA 3 - DIAGNÓSTICO PERSONALIZADO
 *
 * Objetivo: gerar identificação + dor + urgência
 * Estrutura: validação emocional → nome do erro → explicação → consequência futura
 */
export function ResultScreen() {
  const [, setLocation] = useLocation();
  const { answers } = useQuiz();

  useEffect(() => {
    analytics.trackPageView("result");
  }, []);

  const profileType = getProfile(answers);
  const content = PROFILE_CONTENT[profileType];
  const videoUrl = getVideoUrl(profileType);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [realProgress, setRealProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hasScrolledToCTA = useRef(false);
  const hasScrolledOnPlay = useRef(false);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      // Scroll para baixo somente no primeiro play
      if (!hasScrolledOnPlay.current && videoRef.current) {
        hasScrolledOnPlay.current = true;
        requestAnimationFrame(() => {
          // Encontra o container scrollável (ScreenContainer com overflow-y-auto)
          let el: HTMLElement | null = videoRef.current;
          while (el) {
            const style = getComputedStyle(el);
            if (
              /(auto|scroll)/.test(style.overflowY) &&
              el.scrollHeight > el.clientHeight
            ) {
              el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
              return;
            }
            el = el.parentElement;
          }
          // Fallback: window
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        });
      }
    } else {
      video.pause();
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setRealProgress(video.currentTime / video.duration);
    if (video.duration - video.currentTime <= 21) {
      setShowCTA(true);
    }
  }, []);

  useEffect(() => {
    if (showCTA && !hasScrolledToCTA.current && ctaRef.current) {
      hasScrolledToCTA.current = true;
      ctaRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [showCTA]);

  const handleContinue = () => {
    analytics.trackCTAClick("result_screen");
    setLocation("/solucao");
  };

  return (
    <ScreenContainer fullHeight className="overflow-y-auto">
      {/* Background com gradiente */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-primary/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)] pointer-events-none" />

      <div className="relative flex-1 flex flex-col justify-between py-8 md:py-12">
        {/* Conteúdo central */}
        <div className="flex-1 flex flex-col justify-center space-y-5 md:space-y-7 text-center px-4 max-w-2xl mx-auto w-full">
          {/* Título do perfil */}
          <div className="animate-fade-in-up space-y-3">
            <p className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-[0.2em]">
              Seu diagnóstico
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-primary/40" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-[0.15em] bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent drop-shadow-sm">
                {content.profileName}
              </h2>
              <span className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-primary/40" />
            </div>
          </div>

          {/* VSL do perfil (9:16) — Player customizado */}
          <div
            className="w-full max-w-sm mx-auto rounded-2xl border-2 border-primary/20 overflow-hidden relative shadow-xl shadow-primary/10 bg-black"
            style={{ aspectRatio: "9/16" }}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              onCanPlay={() => setVideoLoaded(true)}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => {
                setIsPlaying(true);
                setIsBuffering(false);
              }}
              onPause={() => setIsPlaying(false)}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onEnded={() => {
                setIsPlaying(false);
                setIsBuffering(false);
                setHasEnded(true);
                setRealProgress(1);
              }}
            />

            {/* Spinner de buffering */}
            {isBuffering && isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <div className="w-12 h-12 border-4 border-white/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}

            {/* Overlay de play/pause — toque em qualquer lugar */}
            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={togglePlay}
            >
              {/* Botão play central — visível quando pausado */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-xl shadow-primary/30">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {hasEnded ? (
                        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                      ) : (
                        <path d="M8 5v14l11-7z" />
                      )}
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Barra de progresso customizada (bottom) */}
            {videoLoaded && (
              <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                {/* Trilho da barra */}
                <div className="h-[6px] bg-white/20">
                  <div
                    className="h-full bg-primary transition-[width] duration-300 ease-out"
                    style={{ width: `${easeProgress(realProgress) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Loading placeholder */}
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <svg
                    className="w-14 h-14 text-primary/60 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-sm font-medium text-foreground/50">
                    Carregando resultado...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA — aparece quando faltam 21s no vídeo */}
          {showCTA && (
            <div
              ref={ctaRef}
              className="flex flex-col items-center space-y-2 md:space-y-3 pt-2 md:pt-4 pb-4 animate-fade-in-up"
            >
              <CTAButton size="lg" onClick={handleContinue} className="w-full">
                Começar Agora
              </CTAButton>
              <p className="text-xs text-muted-foreground">
                Próxima etapa: escolher seu nível de evolução
              </p>
            </div>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
