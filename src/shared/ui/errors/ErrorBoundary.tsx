"use client"
import React, { ReactNode } from 'react'

interface State { hasError: boolean; error?: Error }
interface Props { fallback?: ReactNode; children?: ReactNode }
export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false }
    static getDerivedStateFromError(error: Error): State { return { hasError: true, error } }
    componentDidCatch(error: Error, info: React.ErrorInfo) { if (process.env.NODE_ENV !== 'production') console.error('ErrorBoundary', error, info) }
    reset = () => this.setState({ hasError: false, error: undefined })
    render() {
        if (this.state.hasError) return this.props.fallback || (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-sm text-red-700 dark:text-red-300">
                <p className="font-semibold mb-2">Something went wrong.</p>
                <pre className="whitespace-pre-wrap text-xs opacity-80">{this.state.error?.message}</pre>
                <button onClick={this.reset} className="mt-3 inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white text-xs hover:bg-red-700">Retry</button>
            </div>)
        return this.props.children as ReactNode
    }
}
