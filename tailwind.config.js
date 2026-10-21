/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#F3F0FF',
          200: '#E0DBFF',
          300: '#C7BDFF',
          400: '#9488FF',
          500: '#635BFF',
          600: '#5145E5',
          700: '#4336C7',
          800: '#3427A8',
          900: '#23187F',
          DEFAULT: '#635BFF',
          hover: '#5145E5',
          light: '#F3F0FF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          canvas: '#F8FAFC',
          subtle: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E8EAF2',
          subtle: '#F1F3F9',
          strong: '#D0D4E4',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1e3a5f',
          900: '#0f2744',
          950: '#09182b',
        },
        lpuOrange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-sm': '0 4px 16px 0 rgba(15, 23, 42, 0.05)',
        'glass-lg': '0 16px 48px 0 rgba(99, 91, 255, 0.12)',
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 12px 28px -4px rgba(99, 91, 255, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 1.5s infinite',
      }
    },
  },
  plugins: [],
}
