// ==============================================
// CONFIGURACIÓN DE TEMA Y DISEÑO
// ==============================================

export const themeConfig = {
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      900: "#1e3a8a",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      500: "#64748b",
      600: "#475569",
      900: "#0f172a",
    },
    accent: {
      500: "#f59e0b",
      600: "#d97706",
    },
  },
  fonts: {
    primary: "Onest, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const animations = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;
