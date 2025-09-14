import React from 'react'

export const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700 ${className}`} />
)

export const NeedCardSkeleton = () => (
    <div className="rounded-2xl shadow-lg shadow-deep-navy/10 bg-white dark:bg-neutral-900 p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2">
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-full" />
        </div>
        <Skeleton className="h-2 w-full" />
    </div>
)
