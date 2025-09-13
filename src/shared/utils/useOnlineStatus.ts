"use client"
import { useEffect, useState } from 'react'

export function useOnlineStatus(pollMs = 0) {
    const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

    useEffect(() => {
        function update() { setOnline(navigator.onLine) }
        window.addEventListener('online', update)
        window.addEventListener('offline', update)
        if (pollMs > 0) {
            const id = setInterval(update, pollMs)
            return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); clearInterval(id) }
        }
        return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
    }, [pollMs])

    return online
}
