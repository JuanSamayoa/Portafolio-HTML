// ==============================================
// CONSTANTES DE ACCESIBILIDAD
// ==============================================

export const a11y = {
  // Roles ARIA
  roles: {
    main: "main",
    navigation: "navigation",
    banner: "banner",
    contentinfo: "contentinfo",
    complementary: "complementary",
    article: "article",
    section: "section",
    button: "button",
    link: "link",
    heading: "heading",
    img: "img",
    list: "list",
    listitem: "listitem",
  },

  // Etiquetas ARIA
  labels: {
    skipToMain: "Saltar al contenido principal",
    menuToggle: "Alternar menú de navegación",
    themeToggle: "Cambiar tema",
    closeModal: "Cerrar modal",
    openModal: "Abrir modal",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    warning: "Advertencia",
    info: "Información",
  },

  // Selectores de foco
  focus: {
    outline: "2px solid #3b82f6",
    outlineOffset: "2px",
    transition: "outline 0.2s ease",
  },

  // Colores de contraste
  colors: {
    focus: "#3b82f6",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  },

  // Navegación por teclado
  keyboard: {
    tabIndex: 0,
    tabIndexHidden: -1,
  },
} as const;
