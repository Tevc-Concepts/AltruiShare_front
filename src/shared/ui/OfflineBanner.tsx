"use client"
import React from 'react'
import { useOnlineStatus } from '../utils/useOnlineStatus'
import { Button } from './button'

export const OfflineBanner: React.FC = () => {
    const online = useOnlineStatus()
    if (online) return null
    return (
        <div role="alert" className="w-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-b border-amber-300 dark:border-amber-700 text-sm">
            <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3 justify-between">
                <span className="font-medium">You are offline.</span>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => location.reload()}>Retry</Button>
                </div>
            </div>
        </div>
    )
}
