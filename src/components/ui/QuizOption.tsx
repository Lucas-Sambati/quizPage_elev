import { cn } from "@/lib/utils";

interface QuizOptionProps {
  text: string;
  onClick: () => void;
  className?: string;
}

/**
 * Botão de opção do Quiz
 *
 * Representa cada alternativa clicável nas perguntas do quiz
 * Design otimizado para mobile com área de toque grande
 */
export function QuizOption({ text, onClick, className }: QuizOptionProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    e.currentTarget.blur();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full p-5 text-left rounded-xl border-2 animate-fade-in-up",
        "bg-background/80 backdrop-blur-sm border-border/60",
        "active:border-primary active:bg-primary/10 active:scale-[0.98]",
        "md:hover:border-primary md:hover:bg-primary/5 md:hover:shadow-lg md:hover:shadow-primary/10",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "text-base md:text-lg font-medium text-foreground",
        "group relative overflow-hidden",
        "touch-manipulation",
        className,
      )}
    >
      {/* Indicador visual lateral */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r scale-y-0 group-active:scale-y-100 md:group-hover:scale-y-100 transition-transform origin-center" />

      <div className="flex items-center gap-3">
        {/* Círculo indicador com transição */}
        <div className="w-5 h-5 rounded-full border-2 border-primary/30 group-active:border-primary group-active:bg-primary/20 md:group-hover:border-primary md:group-hover:bg-primary/20 transition-all flex-shrink-0 relative">
          <div className="absolute inset-1 rounded-full bg-primary scale-0 group-active:scale-100 md:group-hover:scale-100 transition-transform" />
        </div>

        <span className="flex-1">{text}</span>

        {/* Seta — aparece no hover desktop */}
        <svg
          className="w-5 h-5 text-primary opacity-0 -translate-x-1 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}
