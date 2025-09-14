import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    // Tailwind v4 removes legacy safelist array; if purge drops needed classes
    // create explicit layer utilities in globals.css (TODO if pruning observed).
    theme: {
        extend: {
            colors: {
                brand: {
                    navy: '#0C2340',
                    green: '#003C2D',
                    emerald: '#3AD29F',
                    teal: '#12B5B1',
                    cobalt: '#2774FF',
                    amber: '#FFB547',
                    coral: '#FF6F59',
                    violet: '#8D4DFF',
                    indigo: '#0C2340', // alias deep navy for utility naming
                    purple: '#8D4DFF', // alias violet
                    pink: '#FF6F59',   // alias coral for gradient continuity
                },
                neutral: {
                    light: '#F5F8F6',
                    medium: '#E8ECEB',
                },
                status: {
                    success: '#10b981',
                    warning: '#f59e0b',
                    danger: '#ef4444'
                },
                surface: {
                    base: 'rgba(255,255,255,0.65)',
                    dark: 'rgba(24,24,27,0.65)'
                }
            },
            backgroundImage: {
                // General utilities
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',

                // Branded gradients
                'brand-hero': 'linear-gradient(to right, #0C2340, #003C2D, #2774FF)',
                'brand-hero-diag': 'linear-gradient(120deg, #0C2340, #003C2D 40%, #2774FF)',
                'brand-soft': 'linear-gradient(135deg, rgba(12,35,64,0.12), rgba(0,60,45,0.12))',

                // Section-specific
                'gradient-donation': 'linear-gradient(to right, #FFB547, #FF6F59)',
                'gradient-volunteer': 'linear-gradient(to right, #3AD29F, #12B5B1)',
                'gradient-logistics': 'linear-gradient(to right, #2774FF, #8D4DFF)',
            },
            boxShadow: {
                soft: '0 4px 12px rgba(12,35,64,0.1)',
                'soft-lg': '0 8px 20px rgba(12,35,64,0.15)',
                elevated: '0 8px 28px -6px rgba(12,35,64,0.25), 0 2px 8px -1px rgba(0,0,0,0.05)',
                'glow-cobalt': '0 0 0 1px rgba(39,116,255,0.4), 0 4px 18px -2px rgba(39,116,255,0.55)',
                'glow-amber': '0 0 0 1px rgba(255,181,71,0.4), 0 4px 18px -2px rgba(255,181,71,0.55)',
                'glow-emerald': '0 0 0 1px rgba(58,210,159,0.4), 0 4px 18px -2px rgba(58,210,159,0.55)',
                'glow-indigo': '0 0 0 1px rgba(12,35,64,0.35), 0 4px 18px -2px rgba(12,35,64,0.5)',
                'glow-pink': '0 0 0 1px rgba(255,111,89,0.35), 0 4px 18px -2px rgba(255,111,89,0.55)'
            },
            borderRadius: {
                'xl2': '1.25rem',
                '2xl': '1.25rem',
                '3xl': '1.75rem'
            },
            keyframes: {
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' }
                }
            },
            animation: {
                'float-slow': 'float 6s ease-in-out infinite'
            }
        }
    },
    plugins: []
}
export default config
