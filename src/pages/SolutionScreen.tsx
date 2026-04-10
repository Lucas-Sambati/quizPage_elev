import { useLocation } from "wouter";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { analytics } from "@/lib/analytics";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Star,
  Crown,
  Zap,
  ChevronDown,
  Lock,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CONFIGURACAO IMPORTANTE
 * URLs base do checkout Kirvano por plano (sem query params)
 */
const CHECKOUT_BASE_URLS: Record<PlanId, string> = {
  start: "https://pay.kirvano.com/998314eb-56e1-4934-a7c9-d9357756aaa0",
  progress: "https://pay.kirvano.com/769cadb9-3e6d-404a-84dd-a96769d3e613",
  elite: "https://pay.kirvano.com/9028b67a-f369-4cfb-a866-df8936a1e029",
};

const UTM_PARAMS = [
  "utm_source",
  "utm_campaign",
  "utm_medium",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

const STORAGE_KEY = "elev_utm_params";

/**
 * Captura UTMs da URL atual e salva em sessionStorage.
 * Deve ser chamado uma vez na chegada do visitante (WelcomeScreen).
 */
export function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  }

  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  }
}

function getStoredUtmParams(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function buildCheckoutUrl(plan: PlanId): string {
  const base = CHECKOUT_BASE_URLS[plan];
  const utm = getStoredUtmParams();
  const checkoutParams = new URLSearchParams();

  for (const key of UTM_PARAMS) {
    if (utm[key]) {
      checkoutParams.set(key, utm[key]);
    }
  }

  const qs = checkoutParams.toString();
  return qs ? `${base}?${qs}` : base;
}

type PlanId = "start" | "progress" | "elite";

interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: string;
  popular: boolean;
  launchAlert: boolean;
  features: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: "start",
    name: "ELEV Start",
    tagline: "Para começar com o pé direito.",
    price: "19,90",
    popular: false,
    launchAlert: false,
    features: [
      "Controle completo de treinos",
      "1 consultoria IA por semana",
      "Gamificação & Ranking",
      "Comunidade",
    ],
    cta: "Começar com o Start",
  },
  {
    id: "progress",
    name: "ELEV Progress",
    tagline: "Para quem quer resultado de verdade.",
    price: "24,90",
    popular: true,
    launchAlert: true,
    features: [
      "Tudo do Start",
      "3 consultorias IA completas/semana",
      "Plano de treino personalizado",
      "Plano alimentar estratégico",
      "Leitura inteligente da sua evolução",
      "Análise com foto do físico",
      "Envio de preferências e objetivos",
      "Mapa muscular e métricas",
    ],
    cta: "Quero o Progress",
  },
  {
    id: "elite",
    name: "ELEV Elite",
    tagline: "Para quem não aceita menos que o máximo.",
    price: "32,90",
    popular: false,
    launchAlert: false,
    features: [
      "Tudo do Progress",
      "5 consultorias IA completas/semana",
      "Conteúdo exclusivo Elite",
      "Badge Elite no ranking",
      "Suporte prioritário",
    ],
    cta: "Quero o Elite",
  },
];

const PLAN_ICONS: Record<PlanId, React.ElementType> = {
  start: Zap,
  progress: Star,
  elite: Crown,
};

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "E se eu não tiver tempo?",
    a: "O ELEV não pede 2 horas do seu dia. Registrar um treino leva segundos. A consultoria de IA entrega tudo pronto — treino e dieta — sem que você precise pesquisar nada. Quem não tem tempo é quem mais precisa de um sistema que organiza tudo por você.",
  },
  {
    q: "Será que funciona pra quem já tentou de tudo?",
    a: "Principalmente pra quem já tentou de tudo. Se você já usou apps, planilhas e personal e nada durou, o problema nunca foi você — foi a abordagem fragmentada. O ELEV é o primeiro sistema que integra tudo: treino, dieta, acompanhamento e motivação. É diferente porque resolve o problema inteiro, não só um pedaço.",
  },
  {
    q: "A IA realmente monta um plano alimentar personalizado?",
    a: "Sim. A cada consultoria, a IA analisa suas métricas, treinos recentes, objetivo e até foto do físico (opcional) para montar um plano alimentar semanal sob medida. Não é um template genérico — é um plano que evolui junto com o seu progresso. Para condições médicas específicas, sempre recomendamos acompanhamento profissional.",
  },
  {
    q: "Nunca treinei. O ELEV funciona pra mim?",
    a: "Foi pensado especialmente pra você. O ELEV tem vídeos de execução para cada exercício, explicações sobre cada grupo muscular e a IA adapta todas as recomendações ao seu nível atual. Você começa no seu ritmo e o sistema cresce junto com a sua evolução.",
  },
  {
    q: "Como funciona a gamificação e o ranking?",
    a: "Cada treino registrado, consultoria feita e meta batida gera XP. Conforme acumula XP, você sobe de nível e escala no ranking da comunidade. É a motivação que faltava para manter a consistência — porque resultado vem de constância, e constância vem de hábito.",
  },
  {
    q: "Qual a diferença entre os planos?",
    a: "Cada plano evolui sobre o anterior. O Start traz 1 consultoria semanal, controle de treinos e ranking. O Progress adiciona 3 consultorias, envio de foto do físico e IA mais profunda. O Elite libera uso intensivo, conteúdos avançados exclusivos, badge no ranking e acesso antecipado a novidades. Se está em dúvida, o Progress é o equilíbrio perfeito entre custo e resultado.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, sem letras miúdas e sem burocracia. Você cancela quando quiser direto pelo app, sem precisar ligar pra ninguém. Mas sendo sincero: quem começa a ver os resultados no dashboard não quer mais parar.",
  },
  {
    q: "O que torna o ELEV diferente de outros apps de treino?",
    a: "A maioria dos apps só controla séries e repetições. O ELEV integra controle de treino + consultoria alimentar com IA + gamificação + comunidade em uma única experiência. É como ter um personal, um nutricionista e uma comunidade motivadora no seu bolso — por uma fração do custo.",
  },
  {
    q: "Vale mais do que uma mensalidade de academia?",
    a: "Academia te dá espaço para treinar. O ELEV te diz o que fazer, quanto comer e por que você estava estagnado. Treino personalizado, plano alimentar e análise inteligente de IA — por um valor igual ou menor ao de muitas academias. A diferença é: academia é uma estrutura. O ELEV é um sistema.",
  },
];

/**
 * TELA 4 - PLANOS + FAQ + CTA
 */
export function SolutionScreen() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    analytics.trackPageView("solution");
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = (e: React.MouseEvent, plan: PlanId) => {
    e.preventDefault();
    analytics.trackCheckout();
    analytics.trackCTAClick(`solution_screen_checkout_${plan}`);
    window.location.href = buildCheckoutUrl(plan);
  };

  return (
    <ScreenContainer>
      {/* Background gradiente */}
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10 pointer-events-none -z-10" />

      <div className="space-y-10 pb-8">
        {/* HEADER */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Próximo passo
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-primary/40" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.1em] bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent">
              Escolha sua evolução
            </h1>
            <span className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* CARDS DE PLANO */}
        <div className="space-y-8">
          {PLANS.map((plan) => {
            const Icon = PLAN_ICONS[plan.id];
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border-2 bg-muted/40 transition-all duration-200",
                  plan.popular
                    ? "border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                    : "border-border shadow-sm",
                )}
              >
                {/* Badge mais popular */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-primary/30">
                      <Star className="w-3 h-3 fill-white" />
                      Mais popular
                    </div>
                  </div>
                )}

                <div className="p-5 md:p-6">
                  {/* Nome e descricao */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        plan.popular
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2
                        className={cn(
                          "text-xl font-bold leading-tight",
                          plan.popular ? "text-primary" : "text-foreground",
                        )}
                      >
                        {plan.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Alerta de preco de lancamento */}
                  {plan.launchAlert && (
                    <div className="mb-4 flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Preco de lancamento</strong> &mdash; oferta
                        limitada
                      </span>
                    </div>
                  )}

                  {/* Preco */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-sm text-muted-foreground font-medium">
                      R$
                    </span>
                    <span
                      className={cn(
                        "text-4xl font-extrabold tracking-tight",
                        plan.popular ? "text-primary" : "text-foreground",
                      )}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/mes</span>
                  </div>

                  <div className="h-px bg-border mb-4" />

                  {/* Features */}
                  <ul className="space-y-2.5 mb-5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2
                          className={cn(
                            "w-4 h-4 flex-shrink-0 mt-0.5",
                            plan.popular ? "text-primary" : "text-primary/70",
                          )}
                        />
                        <span
                          className={cn(
                            i === 0 &&
                              (plan.id === "progress" || plan.id === "elite")
                              ? "font-semibold text-foreground"
                              : "text-foreground/80",
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={buildCheckoutUrl(plan.id)}
                    onClick={(e) => handleCheckout(e, plan.id)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 w-full",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      "active:scale-95",
                      plan.popular
                        ? "h-14 px-8 text-lg min-w-[240px] bg-gradient-to-r from-primary to-primary/85 text-white hover:from-primary/90 hover:to-primary/75 animate-cta-glow"
                        : "h-12 px-6 text-base min-w-[200px] border-2 border-primary text-primary hover:bg-primary hover:text-white",
                    )}
                  >
                    {plan.cta}
                  </a>
                  <div className="flex items-center justify-center gap-3 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-primary" />
                      <span>Pagamento seguro</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-primary" />
                      <span>7 dias de garantia</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SOCIAL PROOF */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-primary/30" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Eles já estiveram no seu lugar
            </h2>
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Diego", src: "/img/Diego.webp" },
              { name: "Lucas", src: "/img/Lucas.webp" },
              { name: "Murilo", src: "/img/Murilo.webp" },
              { name: "Raul", src: "/img/Raul.webp" },
            ].map((person) => (
              <div
                key={person.name}
                className="relative overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={person.src}
                  alt={person.name}
                  className="w-full aspect-[18/16] object-cover"
                  loading="lazy"
                  decoding="async"
                  width={300}
                  height={267}
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                  <span className="text-xs font-semibold text-white">
                    {person.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-primary/30" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Perguntas frequentes
            </h2>
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-primary/30" />
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-muted/30 transition-colors cursor-pointer"
                  aria-expanded={openFaq === index}
                >
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200",
                      openFaq === index && "rotate-180",
                    )}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 border-t border-border/50 pt-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* VOLTAR */}
        <div className="text-center">
          <button
            onClick={() => setLocation("/resultado")}
            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
}
