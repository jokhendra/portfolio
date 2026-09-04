import type { Config } from 'tailwindcss'

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Semantic tokens defined in globals.css so both themes share one API.
        ink: 'var(--ink)',
        muted: 'var(--ink-muted)',
        faint: 'var(--ink-faint)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        surface: 'var(--surface)',
        elevated: 'var(--bg-elevated)',
        canvas: 'var(--bg)',
      },
      keyframes: {
        'flow-dash': {
          from: { strokeDashoffset: '18' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        'flow-dash': 'flow-dash 1.4s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
