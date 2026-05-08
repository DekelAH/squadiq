import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          1: '#1a1d27',
          2: '#222636',
          3: '#2c3047',
          600: '#3a3f5c',
          800: '#1a1d27',
          900: '#0f1117',
        },
        military: {
          DEFAULT: '#4a7c59',
          light: '#5c9970',
          dark: '#35593f',
        },
        amber: {
          squad: '#e8a020',
        },
        team1: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        team2: {
          DEFAULT: '#dc2626',
          light: '#ef4444',
          dark: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config