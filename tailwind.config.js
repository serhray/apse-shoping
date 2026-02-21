/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066cc',
          dark: '#004fa3',
          light: '#3388dd',
        },
        secondary: {
          DEFAULT: '#f5a623',
          dark: '#d48b0e',
        },
        accent: '#e63946',
        topbar: '#1a2b4a',
        navbar: '#0a6db3',
        navbarbottom: '#0c7fd1',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', lg: '2rem' },
        screens: { xl: '1280px' },
      },
    },
  },
  plugins: [],
}
