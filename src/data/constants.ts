// ==============================================
// CONSTANTES GLOBALES
// ==============================================

export const CONSTANTS = {
  // Validaciones
  VALIDATION: {
    DEBOUNCE_DELAY: 300,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 5,
    RATE_LIMIT: {
      MAX_REQUESTS: 10,
      WINDOW_MS: 60000, // 1 minuto
    },
  },

  // UI
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 4000,
    SCROLL_OFFSET: 100,
  },

  // API
  API: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },

  // SEO
  SEO: {
    OG_IMAGE_WIDTH: 1200,
    OG_IMAGE_HEIGHT: 630,
    TWITTER_CARD: "summary_large_image",
  },
} as const;
