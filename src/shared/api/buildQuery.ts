export function buildQuery(params: Record<string, unknown>): string {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        if (typeof v === 'string' && v.trim() === '') return
        if (Array.isArray(v)) {
            if (v.length === 0) return
            search.set(k, JSON.stringify(v))
            return
        }
        if (typeof v === 'object') {
            search.set(k, JSON.stringify(v))
            return
        }
        search.set(k, String(v))
    })
    const qs = search.toString()
    return qs ? `?${qs}` : ''
}
