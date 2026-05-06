/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // TODO: definir paleta de colores de Meridian
      colors: {
        meridian: {
          primary:   '#TODO',   // color principal de marca
          secondary: '#TODO',   // color secundario
          accent:    '#TODO',   // color de acento para CTAs
          dark:      '#TODO',   // fondo oscuro si se usa dark mode
        },
      },
      // TODO: agregar fuentes de marca si se usan fuentes custom de Google Fonts
      fontFamily: {
        sans: ['TODO: fuente principal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
