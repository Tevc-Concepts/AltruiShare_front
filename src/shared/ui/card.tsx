import * as React from 'react'
import { cn } from '../utils/cn'

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('rounded-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur border border-white/40 dark:border-neutral-800 shadow-soft-lg p-6', className)}
        {...props}
    />
)

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('mb-4', className)} {...props} />
)

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
)

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('space-y-3 text-sm', className)} {...props} />
)
