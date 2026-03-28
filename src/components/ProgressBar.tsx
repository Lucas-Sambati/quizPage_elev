import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

/**
 * Barra de progresso do funil
 * Mostra visualmente o avanço do usuário pelas etapas
 *
 * @param progress - Porcentagem de 0 a 100
 */
export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "w-full bg-muted rounded-full h-2 overflow-hidden",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-primary via-primary/80 to-primary relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
