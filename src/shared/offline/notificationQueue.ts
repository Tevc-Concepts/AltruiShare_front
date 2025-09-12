type Action = { type: 'markRead'; id: string } | { type: 'markAll' }

const STORAGE_KEY = 'altruishare_notification_queue_v1'

function load(): Action[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch { return [] }
}

function save(queue: Action[]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(queue)) } catch { }
}

let inMemory = load()

export function enqueue(action: Action) {
    inMemory.push(action)
    save(inMemory)
}

export function getQueue() { return [...inMemory] }

export function clearQueue() { inMemory = []; save(inMemory) }

export async function flush(processor: (a: Action) => Promise<void>) {
    const copy = [...inMemory]
    for (const action of copy) {
        try {
            await processor(action)
            inMemory = inMemory.filter(a => a !== action)
            save(inMemory)
        } catch {
            // Stop on first failure to retry later
            break
        }
    }
}

export function setupAutoFlush(processor: (a: Action) => Promise<void>) {
    if (typeof window === 'undefined') return
    const handler = () => { if (navigator.onLine) flush(processor) }
    window.addEventListener('online', handler)
    // attempt immediate flush
    if (navigator.onLine) flush(processor)
    return () => window.removeEventListener('online', handler)
}
