import { useLocation } from "wouter";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { CTAButton } from "@/components/ui/CTAButton";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

/**
 * TELA 1 - ENTRADA / HOOK
 *
 * Primeira tela do funil
 * Objetivo: Prender atenção e fazer usuário clicar em menos de 5 segundos
 */
export function WelcomeScreen() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    analytics.trackPageView("welcome");
  }, []);

  const handleStart = () => {
    analytics.trackQuizStart();
    analytics.trackCTAClick("welcome_screen");
    setLocation("/quiz/1");
  };

  return (
    <ScreenContainer fullHeight>
      {/* Background com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10 pointer-events-none" />

      <div className="relative flex-1 flex flex-col justify-between py-8 md:py-12">
        {/* Topo com badge de credibilidade */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Baseado em estudos e aplicação prática</span>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="flex-1 flex flex-col justify-center space-y-6 text-center px-4">
          {/* Ícone visual */}
          <div className="flex justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}img/elev_logo.webp`}
                alt="Elev"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Headline principal */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight px-2">
              Descubra em <span className="text-primary">60 segundos</span> por
              que você não tem o corpo dos sonhos
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-2">
              Responda até 5 perguntas rápidas e resolva este problema.
            </p>
          </div>

          {/* Benefícios em lista */}
          <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
            {[
              "✓ Direcionamento baseado no seu perfil",
              "✓ Resultados imediatos",
              "✓ 100% gratuito",
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm md:text-base text-foreground/80"
              >
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA fixo na parte inferior */}
        <div className="flex flex-col items-center space-y-4 px-4">
          <CTAButton
            size="lg"
            onClick={handleStart}
            className="w-full max-w-md shadow-2xl shadow-primary/20 hover:shadow-primary/30"
          >
            🚀 Começar diagnóstico gratuito
          </CTAButton>

          {/* Textos auxiliares de confiança */}
          <div className="space-y-1 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">
              ⏱️ Leva menos de 1 minuto
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              🔒 Não precisa de cadastro
            </p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
