/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}',
    './public/**/*.html',
    './index.html',
  ],
  darkMode: 'class', // Habilita el dark mode basado en clases
  theme: {
    extend: {
      colors: {
        // Rojo suave pero visible (coral rojizo)
        primary: '#d64045',
        
        // Celeste de la bandera de Guatemala
        secondary: '#75aadb',
        
        // Color crema cálido
        accent: '#f9f4da',
        
        // Gris azulado como neutral
        neutral: '#5c6378',
        
        'base-100': '#ffffff',
      },
    },
  },
  plugins: [],
};