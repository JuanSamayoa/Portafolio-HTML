/**
 * DESIGN TOKENS - Sistema de diseño moderno para QA/Developer Jr
 * Paleta profesional con énfasis en claridad, confianza y modernidad
 */

export const tokens = {
  // Colores base - Neutros profesionales
  colors: {
    // Backgrounds principales
    background: {
      primary: "#0a0a0b",
      secondary: "#111113",
      tertiary: "#1a1a1d",
      elevated: "#242428",
    },

    // Textos y foregrounds
    foreground: {
      primary: "#ffffff",
      secondary: "#b4b4b8",
      tertiary: "#6e6e73",
      muted: "#48484d",
    },

    // Colores de marca - Azul tech profesional
    brand: {
      50: "#e6f2ff",
      100: "#b3d9ff",
      200: "#80c0ff",
      300: "#4da6ff",
      400: "#1a8cff",
      500: "#0066ff", // Principal
      600: "#0052cc",
      700: "#003d99",
      800: "#002966",
      900: "#001433",
    },

    // Acento - Verde success para QA
    success: {
      50: "#e6f9f0",
      100: "#b3f0d4",
      200: "#80e7b8",
      300: "#4dde9c",
      400: "#1ad580",
      500: "#00cc66", // Principal
      600: "#00a352",
      700: "#007a3d",
      800: "#005229",
      900: "#002914",
    },

    // Warning - Para highlights y CTAs
    warning: {
      50: "#fff9e6",
      100: "#ffecb3",
      200: "#ffdf80",
      300: "#ffd24d",
      400: "#ffc51a",
      500: "#ffb800", // Principal
      600: "#cc9300",
      700: "#996e00",
      800: "#664a00",
      900: "#332500",
    },

    // Error - Para validaciones
    error: {
      50: "#ffe6e6",
      100: "#ffb3b3",
      200: "#ff8080",
      300: "#ff4d4d",
      400: "#ff1a1a",
      500: "#ff0000",
      600: "#cc0000",
      700: "#990000",
      800: "#660000",
      900: "#330000",
    },

    // Glassmorphism effects
    glass: {
      light: "rgba(255, 255, 255, 0.05)",
      medium: "rgba(255, 255, 255, 0.08)",
      heavy: "rgba(255, 255, 255, 0.12)",
    },
  },

  // Espaciado consistente
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
    "5xl": "8rem", // 128px
  },

  // Tipografía
  typography: {
    fonts: {
      sans: '"Inter", system-ui, -apple-system, sans-serif',
      mono: '"Fira Code", "JetBrains Mono", monospace',
    },
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "2rem", // 32px
      "4xl": "2.5rem", // 40px
      "5xl": "3rem", // 48px
      "6xl": "4rem", // 64px
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeights: {
      tight: "1.2",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // Bordes y radios
  borders: {
    radius: {
      sm: "0.375rem", // 6px
      md: "0.5rem", // 8px
      lg: "0.75rem", // 12px
      xl: "1rem", // 16px
      full: "9999px",
    },
    width: {
      thin: "1px",
      medium: "2px",
      thick: "4px",
    },
  },

  // Sombras modernas
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
    md: "0 4px 6px rgba(0, 0, 0, 0.15)",
    lg: "0 10px 20px rgba(0, 0, 0, 0.2)",
    xl: "0 20px 40px rgba(0, 0, 0, 0.25)",
    glow: "0 0 20px rgba(0, 102, 255, 0.4)",
    glowSuccess: "0 0 20px rgba(0, 204, 102, 0.4)",
  },

  // Animaciones
  animations: {
    durations: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      slower: "800ms",
    },
    easings: {
      smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
  },
} as const;

export type Tokens = typeof tokens;
