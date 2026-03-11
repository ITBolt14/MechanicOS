/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4fe',
          100: '#dde6fd',
          200: '#c2d3fb',
          300: '#98b6f8',
          400: '#6690f3',
          500: '#4169ee',
          600: '#2b4ae3',
          700: '#2338d0',
          800: '#2230a9',
          900: '#212d85',
          950: '#181e51',
        },
        surface: {
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e4e8f0',
          300: '#d0d7e4',
          400: '#9aa3b8',
          500: '#6b7691',
          600: '#4e5a73',
          700: '#3a4459',
          800: '#252d3d',
          900: '#161c2a',
          950: '#0d1118',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}