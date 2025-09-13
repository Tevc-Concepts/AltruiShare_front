import React from 'react'
import Protected from '../../shared/ui/Protected'

export default function DonatePage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Donate</h1>
            <Protected fallback={<p className="text-sm text-neutral-600">Sign in to create or manage donations. Browse public needs below.</p>}>
                <p className="mb-2">You are authenticated. Donation management tools appear here.</p>
            </Protected>
        </div>
    )
}
