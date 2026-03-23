import { cn } from '@/lib/utils'

interface ScreenContainerProps {
  children: React.ReactNode
  className?: string
  fullHeight?: boolean
}

/**
 * Container padrão para todas as telas do funil
 * 
 * Centraliza conteúdo e aplica padding consistente
 * Otimizado para mobile-first
 */
export function ScreenContainer({ children, className, fullHeight = false }: ScreenContainerProps) {
  return (
    <div className={cn(
      'w-full flex flex-col relative',
      fullHeight ? 'min-h-screen h-screen' : 'min-h-screen',
      'bg-background',
      className
    )}>
      <div className={cn(
        'flex-1 flex flex-col w-full mx-auto',
        fullHeight ? 'max-w-2xl h-full' : 'max-w-2xl px-4 py-6'
      )}>
        {children}
      </div>
    </div>
  )
}
