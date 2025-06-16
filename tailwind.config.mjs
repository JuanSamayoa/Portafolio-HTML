/** @type {import('tailwindcss').Config} */

import { designTokens, shadows, typography, animations, breakpoints } from './src/design-system/tokens.ts';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}',
    './public/**/*.html',
    './index.html',
  ],
  darkMode: 'class',
  theme: {
    // Sobrescribir breakpoints con nuestros tokens
    screens: breakpoints,
      extend: {
      // Paleta de colores profesional
      colors: {
        // Colores directos para usar como bg-primary, text-primary, etc.
        primary: designTokens.primary[500],
        secondary: designTokens.secondary[500],
        accent: designTokens.accent[500],
        muted: designTokens.neutral[600],
        background: designTokens.neutral[50],
        
        // Paletas completas para usar como bg-primary-500, text-secondary-600, etc.
        'primary-palette': designTokens.primary,
        'secondary-palette': designTokens.secondary,
        'accent-palette': designTokens.accent,
        'neutral-palette': designTokens.neutral,
        
        // Estados semánticos
        success: designTokens.semantic.success,
        warning: designTokens.semantic.warning,
        error: designTokens.semantic.error,
        info: designTokens.semantic.info,
        
        // Backward compatibility (mantener por si acaso)
        'base-100': '#ffffff',
      },
      
      // Tipografía profesional
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      
      // Sombras profesionales
      boxShadow: shadows,
      
      // Animaciones y transiciones
      transitionDuration: animations.duration,
      transitionTimingFunction: animations.easing,
      
      // Gradientes personalizados
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgb(59 130 246) 0%, rgb(29 78 216) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, rgb(34 197 94) 0%, rgb(21 128 61) 100%)',
        'gradient-accent': 'linear-gradient(135deg, rgb(245 158 11) 0%, rgb(217 119 6) 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgb(59 130 246) 0%, rgb(30 64 175) 50%, rgb(29 78 216) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        
        // Patrones de fondo profesionales
        'dot-pattern': 'radial-gradient(circle, rgb(148 163 184 / 0.1) 1px, transparent 1px)',
        'grid-pattern': 'linear-gradient(rgb(148 163 184 / 0.1) 1px, transparent 1px), linear-gradient(90deg, rgb(148 163 184 / 0.1) 1px, transparent 1px)'
      },
      
      // Tamaños de patrón de fondo
      backgroundSize: {
        'dot-sm': '16px 16px',
        'dot-md': '24px 24px',
        'dot-lg': '32px 32px',
        'grid-sm': '16px 16px',
        'grid-md': '24px 24px',
        'grid-lg': '32px 32px'
      },
      
      // Border radius profesional
      borderRadius: {
        'none': '0px',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px'
      },
      
      // Espaciado adicional
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '128': '32rem',
        '144': '36rem'
      },
      
      // Z-index profesional
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      },
      
      // Animaciones personalizadas
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
};