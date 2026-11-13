export const es = {
  nav: {
    impacto: "impacto",
    servicios: "servicios",
    casos: "casos",
    sobre: "sobre",
    experiencia: "experiencia",
    proyectos: "proyectos",
    stack: "stack",
    certs: "certs",
    contacto: "contacto",
    blog: "blog",
    inicio: "Inicio",
    abiertoMenu: "Abrir menú de navegación",
    cerradoMenu: "Cerrar menú de navegación",
    saltarContenido: "Saltar al contenido principal",
  },
  footer: {
    builtWith: "built with",
    deployedOn: "deployed on",
    copyright: "© {year} Juan Samayoa · Ciudad de Guatemala",
    en: "EN",
    es: "ES",
    switch: "Cambiar idioma",
  },
  seo: {
    site: "Juan Samayoa Portfolio",
    locale: "es",
    twitterHandle: "@JSamayoa_",
    alt: "Vista previa del portafolio de Juan Samayoa",
  },
} as const;

export type Translations = typeof es;

export const en = {
  nav: {
    impacto: "impact",
    servicios: "services",
    casos: "cases",
    sobre: "about",
    experiencia: "experience",
    proyectos: "projects",
    stack: "stack",
    certs: "certs",
    contacto: "contact",
    blog: "blog",
    inicio: "Home",
    abiertoMenu: "Open navigation menu",
    cerradoMenu: "Close navigation menu",
    saltarContenido: "Skip to main content",
  },
  footer: {
    builtWith: "Built with",
    deployedOn: "deployed on",
    copyright: "© {year} Juan Samayoa · Guatemala City",
    en: "EN",
    es: "ES",
    switch: "Switch language",
  },
  seo: {
    site: "Juan Samayoa Portfolio",
    locale: "en",
    twitterHandle: "@JSamayoa_",
    alt: "Preview of Juan Samayoa Portfolio",
  },
} as const;
