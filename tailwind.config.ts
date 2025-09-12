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
          purple: '#8b5cf6',
          pink: '#ec4899'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brand-hero': 'linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)'
      },
      boxShadow: {
        'soft': '0 4px 24px -2px rgba(99,102,241,0.15)',
        'soft-lg': '0 8px 32px -4px rgba(139,92,246,0.25)'
      },
      borderRadius: {
        'xl2': '1.25rem'
      }
    }
  },
  plugins: []
}
export default config
