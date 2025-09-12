"use client"
import React, { useState } from 'react'
import { useAuth } from '../../shared/context/AuthProvider'
import { Button } from '../../shared/ui/button'
import { Input } from '../../shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/card'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const { register, loading, user } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState<string | null>(null)

    React.useEffect(() => {
        if (user) router.replace('/')
    }, [user, router])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            await register(email, password, fullName)
            router.push('/')
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Registration failed'
            setError(msg)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                        <Button type="submit" loading={loading} className="w-full">Create Account</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
