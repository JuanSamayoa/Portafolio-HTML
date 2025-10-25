/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0b',
          secondary: '#111113',
          tertiary: '#1a1a1d',
          elevated: '#242428',
        },
        foreground: {
          primary: '#ffffff',
          secondary: '#b4b4b8',
          tertiary: '#6e6e73',
          muted: '#48484d',
        },
        brand: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        success: {
          50: '#e6f9f0',
          100: '#b3f0d4',
          200: '#80e7b8',
          300: '#4dde9c',
          400: '#1ad580',
          500: '#00cc66',
          600: '#00a352',
          700: '#007a3d',
          800: '#005229',
          900: '#002914',
        },
        warning: {
          50: '#fff9e6',
          100: '#ffecb3',
          200: '#ffdf80',
          300: '#ffd24d',
          400: '#ffc51a',
          500: '#ffb800',
          600: '#cc9300',
          700: '#996e00',
          800: '#664a00',
          900: '#332500',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 102, 255, 0.4)',
        glowSuccess: '0 0 20px rgba(0, 204, 102, 0.4)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
