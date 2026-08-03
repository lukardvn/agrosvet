/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#f4f7f1',
          100: '#e4ecde',
          200: '#c9d9bf',
          300: '#a5bf97',
          400: '#7d9f6c',
          500: '#5f8351',
          600: '#496b3e',
          700: '#395431',
          800: '#304429',
          900: '#1f2a18',
          950: '#11180f',
        },
        earth: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0c1b3',
          400: '#d3a088',
          500: '#c27d5f',
          600: '#ad5d3f',
          700: '#914d35',
          800: '#75402d',
          900: '#633729',
          950: '#351c14',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        bold: '450',
        extrabold: '500',
        black: '550',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
