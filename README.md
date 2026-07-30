# Portafolio Profesional — Juan Samayoa

Portafolio estático desarrollado con Astro para mostrar perfil profesional de QA Automation Engineer.

**Sitio en producción:** [juan-samayoa.is-a.dev](https://juan-samayoa.is-a.dev)

---

## Descripción

Sitio estático de alto rendimiento diseñado para posicionamiento profesional en automatización de pruebas, QA manual y validación de datos. Incluye 12 secciones: hero, impacto, servicios, casos de éxito, sobre mí, experiencia, proyectos, stack tecnológico, toolkit, FAQ, certificaciones y contacto.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Astro | 7.x | Framework estático, build y routing |
| TypeScript | 6.x | Tipado estricto en toda la base de código |
| Tailwind CSS | 4.x | Estilos a través del plugin Vite |
| PostCSS | 8.x | Procesamiento CSS |
| Cloudinary | — | Hosting de imágenes (proyectos, certificaciones, perfil) |
| FormSubmit | — | Servicio de formulario de contacto |

## Estructura del Proyecto

```
├── public/                  # Assets estáticos (favicon, icons, CVs, service worker)
│   ├── assets/
│   │   ├── cv/              # CVs en PDF (ES/EN)
│   │   ├── icons/           # Iconos PWA (192px, 512px, maskables)
│   │   └── img/             # Imágenes locales (perfil, fallback)
│   ├── _headers             # Security headers (Cloudflare/Netlify)
│   ├── manifest.json        # PWA manifest
│   ├── robots.txt           # Reglas de crawlers + bloqueo AI
│   ├── security.txt         # Política de divulgación de vulnerabilidades
│   ├── sitemap.xml          # Sitemap XML
│   └── sw.js                # Service worker (cache offline + PWA)
├── src/
│   ├── components/          # 12 componentes Astro (uno por sección)
│   │   ├── Hero.astro
│   │   ├── Impact.astro
│   │   ├── Services.astro
│   │   ├── Cases.astro
│   │   ├── About.astro
│   │   ├── Experience.astro
│   │   ├── Projects.astro
│   │   ├── Skills.astro
│   │   ├── Toolkit.astro
│   │   ├── Faq.astro
│   │   ├── Certifications.astro
│   │   └── Contact.astro
│   ├── data/                # Contenido estructurado (TypeScript)
│   │   ├── personal.ts      # Datos personales y redes
│   │   ├── projects.ts      # Proyectos con URLs de Cloudinary
│   │   └── certifications.ts # 21 certificaciones (featured + additional)
│   ├── pages/               # Rutas
│   │   ├── index.astro      # Página principal (SPA)
│   │   └── thanks.astro     # Confirmación de formulario
│   ├── styles/
│   │   └── global.css       # Estilos globales + CSS variables + responsive
│   └── types/
│       └── portfolio.ts     # Interfaces TypeScript (PersonalInfo, Project, Certification, Badge)
├── astro.config.mjs         # Configuración de Astro + Vite + seguridad
├── tailwind.config.cjs       # Configuración mínima de Tailwind
├── tsconfig.json             # TypeScript strict mode
├── deploy-github.ps1         # Script de deploy (PowerShell)
└── deploy-github.sh          # Script de deploy (Bash)
```

## Características

- **Rendimiento:** Sitio estático con build optimizado, cache de service worker y carga diferida de imágenes
- **SEO:** Meta tags Open Graph, Twitter Cards, Schema.org JSON-LD, sitemap.xml, robots.txt con bloqueo de AI crawlers
- **Seguridad:** Content-Security-Policy, X-Frame-Options, HSTS, headers de Cross-Origin en `_headers` y meta tags como fallback
- **PWA:** Manifest.json, service worker con estrategias de cache (Cache First, Network First, Stale While Revalidate)
- **Accesibilidad:** Etiquetas aria, contraste de colores, estructura semántica HTML5
- **Responsive:** Diseño mobile-first con breakpoints en 640px y 940px
- **Formulario:** Integrado con FormSubmit.co (honeypot anti-spam, redirect a /thanks)

## Seguridad

El proyecto incluye múltiples capas de protección:

- **`_headers`** — Headers HTTP para hosting compatible (Cloudflare Pages, Netlify)
- **Meta tags CSP** — Content-Security-Policy como fallback en HTML (funciona en GitHub Pages)
- **`robots.txt`** — Bloquea GPTBot, ChatGPT-User, CCBot, Google-Extended, anthropic-ai, ClaudeBot
- **`security.txt`** — Estándar RFC 9116 en `/.well-known/security.txt`
- **Service Worker** — Bloqueo de paths sensibles, validación de origen en mensajes

## Dependencias

Mínimas por diseño:

- **Runtime:** `astro` (única dependencia)
- **Dev:** `@astrojs/check`, `@tailwindcss/postcss`, `@tailwindcss/vite`, `postcss`, `tailwindcss`, `typescript`
- **Overrides de seguridad:** `sharp` forzado a 0.35.3 (CVEs en versiones anteriores)

## Autor

**Juan Samayoa** — QA Automation Engineer · Guatemala City
- [Portfolio](https://juan-samayoa.is-a.dev)
- [LinkedIn](https://www.linkedin.com/in/juansamayoa/)
- [GitHub](https://github.com/JuanSamayoa)
