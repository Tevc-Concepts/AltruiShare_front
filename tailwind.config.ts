import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    indigo: '#6366f1',
                    indigoDark: '#4f46e5',
                    purple: '#8b5cf6',
                    purpleDark: '#7e22ce',
                    pink: '#ec4899',
                    pinkDark: '#db2777'
                },
                surface: {
                    base: 'rgba(255,255,255,0.65)',
                    dark: 'rgba(24,24,27,0.65)'
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'brand-hero': 'linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)',
                'brand-hero-diag': 'linear-gradient(120deg, #6366f1, #8b5cf6 40%, #ec4899)',
                'brand-soft': 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.15))'
            },
            boxShadow: {
                'soft': '0 4px 24px -2px rgba(99,102,241,0.15)',
                'soft-lg': '0 8px 32px -4px rgba(139,92,246,0.25)',
                'elevated': '0 8px 28px -6px rgba(99,102,241,0.25), 0 2px 8px -1px rgba(0,0,0,0.05)',
                'glow-indigo': '0 0 0 1px rgba(99,102,241,0.4), 0 4px 18px -2px rgba(99,102,241,0.55)',
                'glow-pink': '0 0 0 1px rgba(236,72,153,0.4), 0 4px 18px -2px rgba(236,72,153,0.55)'
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
