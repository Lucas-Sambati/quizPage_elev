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
    <div className={cn("w-full bg-gray-200 rounded-full h-1.5", className)}>
      <div
        className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
