import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          soft: '#FBEDE9',
        },
        // Warm "paper" surface system — replaces flat white / cool gray.
        paper: '#F7F2EA', // page background (warm cream)
        surface: '#FFFCF6', // raised cards (warm off-white, not pure white)
        sunken: '#EFE8DB', // recessed areas (kanban columns)
        line: '#E6DCCB', // warm hairline borders
        ink: {
          DEFAULT: '#2A2420', // primary text (warm near-black)
          muted: '#7C7264', // secondary text
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(60 40 20 / 0.05), 0 1px 3px -1px rgb(60 40 20 / 0.07)',
        'card-hover':
          '0 12px 28px -8px rgb(60 40 20 / 0.16), 0 3px 8px -3px rgb(60 40 20 / 0.10)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
};

export default config;
