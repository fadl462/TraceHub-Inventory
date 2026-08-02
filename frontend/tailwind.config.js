/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A4D8F',
          50: 'rgb(var(--th-surface-alt) / <alpha-value>)',
          100: 'rgb(var(--th-border) / <alpha-value>)',
          200: '#A3C3E7',
          300: '#75A5DB',
          400: '#4787CF',
          500: '#1A4D8F',
          600: '#153E73',
          700: '#102E56',
          800: '#0A1F3A',
          900: '#050F1D',
        },
        secondary: {
          DEFAULT: '#4DA3FF',
          light: '#8CC2FF',
          dark: '#1C7AE0',
        },
        accent: {
          DEFAULT: '#7ED957',
          dark: '#5CB93A',
        },
        surface: '#F4F7FA',
        ink: 'rgb(var(--th-text) / <alpha-value>)',
        link: 'rgb(var(--th-link) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,46,86,0.06), 0 4px 12px rgba(16,46,86,0.06)',
      },
      borderRadius: {
        xl2: '1rem',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#2C2C2C',
            '--tw-prose-headings': '#2C2C2C',
            '--tw-prose-links': '#1A4D8F',
            '--tw-prose-bold': '#2C2C2C',
            '--tw-prose-bullets': '#1A4D8F',
            '--tw-prose-quotes': '#2C2C2C',
            '--tw-prose-quote-borders': '#D1E1F3',
            maxWidth: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
            h3: { fontFamily: '"Space Grotesk", Inter, sans-serif', fontWeight: 600, marginTop: '2em' },
            p: { lineHeight: '1.75' },
            'p + p': { marginTop: '1.25em' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
