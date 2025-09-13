import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-xl2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-soft text-sm gap-2',
    {
        variants: {
            variant: {
                primary: 'bg-gradient-to-r from-brand-indigo to-brand-purple text-white hover:opacity-90',
                secondary: 'bg-white text-brand-indigo border border-brand-indigo/30 hover:bg-brand-indigo/5',
                outline: 'bg-transparent border border-brand-indigo text-brand-indigo hover:bg-brand-indigo/10',
                ghost: 'bg-transparent hover:bg-brand-indigo/10 text-brand-indigo'
            },
            size: {
                sm: 'h-8 px-3',
                md: 'h-10 px-4',
                lg: 'h-12 px-6 text-base'
            }
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md'
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                disabled={disabled || loading}
                aria-busy={loading ? 'true' : undefined}
                aria-disabled={disabled || loading ? 'true' : undefined}
                {...props}
            >
                {loading && (
                    <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                <span>{children}</span>
            </button>
        )
    }
)
Button.displayName = 'Button'
