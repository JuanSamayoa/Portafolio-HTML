/**
 * CONSTANTS - Constantes centralizadas del proyecto
 * =================================================
 * Elimina valores mágicos y mejora mantenibilidad
 */

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  REVEAL_DELAY_BASE: 100, // ms
  REVEAL_DELAY_MULTIPLIER: 100, // ms por item
  STAGGER_DELAY: 50, // ms entre elementos de lista
  TRANSITION_DURATION: 300, // ms
  INTERSECTION_THRESHOLD: 0.1,
  INTERSECTION_ROOT_MARGIN: '0px 0px -100px 0px'
} as const;

// Breakpoints de diseño responsivo
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// Configuración de formularios
export const FORM_CONFIG = {
  VALIDATION_DELAY: 300, // ms para debounce
  MAX_MESSAGE_LENGTH: 1000,
  REQUIRED_FIELDS: ['name', 'email', 'message'] as const,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

// URLs y enlaces externos
export const EXTERNAL_LINKS = {
  LINKEDIN: 'https://www.linkedin.com/in/juansamayoa/',
  GITHUB: 'https://github.com/JuanSamayoa',
  EMAIL: 'juancho1705@gmail.com'
} as const;

// Configuración de certificados
export const CERT_CONFIG = {
  INITIAL_DISPLAY_COUNT: 8,
  IMAGES_BASE_PATH: '/assets/certificates/',
  MODAL_ANIMATION_DURATION: 200 // ms
} as const;

// Configuración SEO
export const SEO_CONFIG = {
  SITE_NAME: 'Juan Samayoa - QA & Frontend Developer',
  SITE_URL: 'https://juan-samayoa.is-a.dev',
  DEFAULT_IMAGE: '/assets/img/profile.webp',
  TWITTER_HANDLE: '@juansamayoa'
} as const;
