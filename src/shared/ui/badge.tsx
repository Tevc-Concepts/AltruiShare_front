import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium select-none gap-1 transition-colors',
    {
        variants: {
            variant: {
                solid: 'bg-brand-indigo text-white border-transparent shadow-soft',
                subtle: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
                outline: 'border-brand-indigo text-brand-indigo bg-transparent',
                success: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
                warning: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
                danger: 'bg-rose-500/15 text-rose-600 border-rose-500/30'
            },
            size: {
                sm: 'h-5',
                md: 'h-6',
            }
        },
        defaultVariants: {
            variant: 'subtle',
            size: 'md'
        }
    }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
    leadingIcon?: React.ReactNode
    trailingIcon?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, size, leadingIcon, trailingIcon, children, ...props }, ref) => {
        return (
            <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
                {leadingIcon && <span aria-hidden="true" className="shrink-0 inline-flex">{leadingIcon}</span>}
                <span>{children}</span>
                {trailingIcon && <span aria-hidden="true" className="shrink-0 inline-flex">{trailingIcon}</span>}
            </span>
        )
    }
)
Badge.displayName = 'Badge'

export { badgeVariants }
