import { NeedsList } from './components/NeedsList'

export const NeedsFeature = () => {
    return (
        <section>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-brand-hero">Needs</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Browse and filter current community needs.</p>
            </div>
            <NeedsList />
        </section>
    )
}
