import React from 'react'
// Import only required primitives directly to avoid bringing in motion components
import { Button } from '../../shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/card'

export const runtime = 'edge'

export default function OfflinePage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-brand-soft">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle>You&apos;re offline</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        A stable network connection is required for dynamic data. You can still browse cached pages. We&apos;ll
                        retry automatically when you&apos;re back online.
                    </p>
                    <div className="pt-4 flex flex-col gap-2">
                        <Button onClick={() => location.reload()} variant="secondary">Retry Connection</Button>
                        <Button variant="ghost" onClick={() => history.back()}>Go Back</Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
