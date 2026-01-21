/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './constants.tsx',
    './types.ts'
  ],
  theme: {
    extend: {
      colors: {
        lexcora: {
          blue: '#0F172A',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          charcoal: '#36454F',
          paper: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'sans-serif'],
        serif: ['Playfair Display', 'Times New Roman', 'serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    },
  },
  plugins: [],
};
