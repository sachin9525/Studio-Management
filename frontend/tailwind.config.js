/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f5f2',
          100: '#e8e4df',
          200: '#d1cbc3',
          300: '#b4aca2',
          400: '#948a7e',
          500: '#756b61',
          600: '#5b534c',
          800: '#302b28',
          900: '#211e1c',
          950: '#151311',
        },
        gold: {
          300: '#f0d38b',
          400: '#d8b36a',
          500: '#bd9148',
          600: '#9a7134',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      letterSpacing: {
        'widest-2': '0.2em',
      },
    },
  },
  plugins: [],
};
