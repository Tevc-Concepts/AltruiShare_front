"use client"
import React, { useEffect } from 'react'
import { useFileUpload } from '../../upload/hooks/useFileUpload'
import { userApi } from '../../../shared/api/endpoints/user'
import { useAuth } from '../../../shared/context/AuthProvider'

interface Props { onUploaded?: () => void }

export const AvatarUpload: React.FC<Props> = ({ onUploaded }) => {
    const { profile, refresh } = useAuth()
    const { queue, enqueue, startAll, clear, remove } = useFileUpload({ auto: true, maxConcurrent: 1 })
    const current = queue[0]

    useEffect(() => {
        if (current && current.status === 'done' && current.uploaded?.file_url) {
            ; (async () => {
                try {
                    await userApi.updateProfile({ avatar_url: current.uploaded!.file_url })
                    await refresh()
                    onUploaded?.()
                } finally {
                    clear()
                }
            })()
        }
    }, [current, clear, refresh, onUploaded])

    function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length) {
            enqueue(e.target.files)
            startAll()
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-cobalt to-violet flex items-center justify-center text-white font-semibold">
                    {profile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.avatar_url} alt={profile.full_name || profile?.email || 'avatar'} className="w-full h-full object-cover" />
                    ) : (profile?.full_name?.[0] || profile?.email?.[0] || '?').toUpperCase()}
                </div>
                <div className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <label className="inline-block">
                        <span className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs cursor-pointer hover:bg-indigo-500 transition">Change Avatar</span>
                        <input type="file" accept="image/*" onChange={onSelect} className="hidden" aria-label="Upload avatar" />
                    </label>
                    {current && (
                        <div className="flex items-center gap-2" aria-live="polite">
                            <div className="w-32 h-1 rounded bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all" style={{ width: `${current.progress}%` }} />
                            </div>
                            <span className="tabular-nums text-[10px]">{current.progress}%</span>
                            {current.status !== 'uploading' && current.status !== 'done' && (
                                <button onClick={() => remove(current.id)} className="text-[10px] text-red-600">Cancel</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AvatarUpload
