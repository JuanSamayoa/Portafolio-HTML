/**
 * DESIGN SYSTEM PROFESIONAL
 * =========================
 * Paleta cromática basada en principios de teoría del color
 * y psicología visual para portafolios tech profesionales
 */

// ==============================================
// PALETA CROMÁTICA PRINCIPAL
// ==============================================

export const designTokens = {
  // Colores Primarios (Azul Profesional Tech)
  primary: {
    50: '#eff6ff',   // Muy claro
    100: '#dbeafe',  // Claro
    200: '#bfdbfe',  
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Base - Azul tech profesional
    600: '#2563eb',  // Más oscuro
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Muy oscuro
    950: '#172554'
  },

  // Colores Secundarios (Verde Éxito/Tech)
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Base - Verde éxito
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },

  // Colores de Acento (Ámbar/Naranja)
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Base - Ámbar profesional
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },

  // Grises Neutrales (Mejorados para contraste)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',  // Base - Gris balanceado
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },

  // Estados (Feedback Visual)
  semantic: {
    success: '#10b981',   // Verde
    warning: '#f59e0b',   // Ámbar
    error: '#ef4444',     // Rojo
    info: '#3b82f6'       // Azul
  }
} as const;

// ==============================================
// GRADIENTES PROFESIONALES
// ==============================================

export const gradients = {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  secondary: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
  accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  neutral: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
  hero: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1d4ed8 100%)',
  card: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
} as const;

// ==============================================
// SOMBRAS PROFESIONALES
// ==============================================

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Sombras de colores para estados
  primary: '0 10px 15px -3px rgb(59 130 246 / 0.1), 0 4px 6px -4px rgb(59 130 246 / 0.1)',
  success: '0 10px 15px -3px rgb(34 197 94 / 0.1), 0 4px 6px -4px rgb(34 197 94 / 0.1)',
  warning: '0 10px 15px -3px rgb(245 158 11 / 0.1), 0 4px 6px -4px rgb(245 158 11 / 0.1)',
  error: '0 10px 15px -3px rgb(239 68 68 / 0.1), 0 4px 6px -4px rgb(239 68 68 / 0.1)'
} as const;

// ==============================================
// TIPOGRAFÍA PROFESIONAL
// ==============================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace']
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }]
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  }
} as const;

// ==============================================
// ESPACIADO Y LAYOUT
// ==============================================

export const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
} as const;

// ==============================================
// BREAKPOINTS RESPONSIVOS
// ==============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// ==============================================
// ANIMACIONES Y TRANSICIONES
// ==============================================

export const animations = {
  transition: {
    none: 'none',
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 150ms cubic-bezier(0.4, 0, 0.2, 1), fill 150ms cubic-bezier(0.4, 0, 0.2, 1), stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

// ==============================================
// UTILIDADES DE COMPONENTES
// ==============================================

export const components = {
  button: {
    primary: {
      bg: designTokens.primary[500],
      hover: designTokens.primary[600],
      active: designTokens.primary[700],
      text: '#ffffff',
      shadow: shadows.primary
    },
    secondary: {
      bg: designTokens.secondary[500],
      hover: designTokens.secondary[600],
      active: designTokens.secondary[700],
      text: '#ffffff',
      shadow: shadows.success
    },
    outline: {
      bg: 'transparent',
      border: designTokens.primary[500],
      hover: designTokens.primary[50],
      text: designTokens.primary[600],
      shadow: shadows.sm
    }
  },
  
  card: {
    bg: '#ffffff',
    border: designTokens.neutral[200],
    shadow: shadows.md,
    hover: shadows.lg,
    dark: {
      bg: designTokens.neutral[800],
      border: designTokens.neutral[700]
    }
  }
} as const;
