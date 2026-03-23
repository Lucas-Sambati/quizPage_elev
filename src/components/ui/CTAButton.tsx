import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'default' | 'lg'
  children: React.ReactNode
}

/**
 * Botão de Call-to-Action
 * 
 * Botão grande e clicável otimizado para mobile
 * Usado em todas as telas do funil
 */
export const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-95',
          {
            'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl':
              variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80':
              variant === 'secondary',
            'border-2 border-primary text-primary hover:bg-primary hover:text-white':
              variant === 'outline',
          },
          {
            'h-12 px-6 text-base min-w-[200px]': size === 'default',
            'h-14 px-8 text-lg min-w-[240px]': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

CTAButton.displayName = 'CTAButton'
