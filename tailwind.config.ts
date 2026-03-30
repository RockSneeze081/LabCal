import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D0D0D',
          secondary: '#1A1A1A',
          tertiary: '#262626',
        },
        border: '#333333',
        text: {
          primary: '#F5F5F5',
          secondary: '#A3A3A3',
          muted: '#737373',
        },
        accent: {
          red: '#DC2626',
          'red-glow': '#EF4444',
          amber: '#F59E0B',
        },
        status: {
          available: '#22C55E',
          occupied: '#EF4444',
          shared: '#3B82F6',
          pending: '#A855F7',
        },
        activity: {
          revelado: '#DC2626',
          ampliacion: '#F59E0B',
          contactos: '#8B5CF6',
          otro: '#6B7280',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
