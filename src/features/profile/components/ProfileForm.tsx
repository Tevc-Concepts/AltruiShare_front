"use client"
import React, { useState } from 'react'
import { useAuth } from '../../../shared/context/AuthProvider'
import { userApi, type UpdateUserProfileInput } from '../../../shared/api/endpoints/user'
import { AvatarUpload } from './AvatarUpload'

interface Props {
    onUpdated?: () => void
    onUploadingAvatar?: (uploading: boolean) => void
}

export const ProfileForm: React.FC<Props> = ({ onUpdated }) => {
    const { profile } = useAuth()
    const [form, setForm] = useState<UpdateUserProfileInput>({
        full_name: profile?.full_name || '',
        organization: profile?.organization || ''
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const disabled = saving

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            await userApi.updateProfile(form)
            onUpdated?.()
        } catch (err) {
            setError((err as Error).message || 'Update failed')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-deep-navy/10">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-deep-navy dark:text-white">Edit Profile</h3>
            </div>
            <AvatarUpload onUploaded={onUpdated} />
            <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full Name">
                    <input
                        value={form.full_name}
                        onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cobalt"
                        placeholder="Jane Doe"
                        disabled={disabled}
                    />
                </Field>
                <Field label="Organization">
                    <input
                        value={form.organization}
                        onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
                        placeholder="My NGO / Company"
                        disabled={disabled}
                    />
                </Field>
            </div>
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={disabled}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-200/40 disabled:opacity-50"
                >
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </form>
    )
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <label className="text-sm font-medium text-deep-navy dark:text-gray-200 flex flex-col gap-1">
        <span>{label}</span>
        {children}
    </label>
)
