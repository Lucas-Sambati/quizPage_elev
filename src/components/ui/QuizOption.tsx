import { cn } from '@/lib/utils'

interface QuizOptionProps {
  text: string
  onClick: () => void
  className?: string
}

/**
 * Botão de opção do Quiz
 * 
 * Representa cada alternativa clicável nas perguntas do quiz
 * Design otimizado para mobile com área de toque grande
 */
export function QuizOption({ text, onClick, className }: QuizOptionProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick()
    // Remove o foco do botão para evitar hover persistente no mobile
    e.currentTarget.blur()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full p-5 text-left rounded-lg border-2',
        'bg-background/80 backdrop-blur-sm border-primary/20',
        // Mobile: efeito visual durante o toque
        'active:border-primary active:bg-primary/10 active:scale-[0.98]',
        // Desktop: efeito hover
        'md:hover:border-primary md:hover:bg-primary/10 md:hover:shadow-lg md:hover:shadow-primary/10',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'text-base md:text-lg font-medium text-foreground',
        'group relative overflow-hidden',
        'touch-manipulation',
        className
      )}
    >
      {/* Indicador visual - aparece no toque (mobile) e hover (desktop) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-active:opacity-100 md:group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-3">
        {/* Círculo indicador */}
        <div className="w-5 h-5 rounded-full border-2 border-primary/30 group-active:border-primary group-active:bg-primary/20 md:group-hover:border-primary md:group-hover:bg-primary/20 transition-all flex-shrink-0" />
        
        <span className="flex-1">{text}</span>
        
        {/* Seta de continuação - só no desktop */}
        <svg 
          className="w-5 h-5 text-primary opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}
