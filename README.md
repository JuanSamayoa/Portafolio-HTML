# Portafolio Profesional — Juan Samayoa

Portafolio estático y blog técnico desarrollado con Astro para el perfil profesional de Juan Samayoa, QA Automation Engineer en Ciudad de Guatemala.

# Portafolio-HTML
**Sitio en producción:** [juan-samayoa.is-a.dev](https://juan-samayoa.is-a.dev)

---

## Descripción

Sitio estático de alto rendimiento con una home de 12 secciones (hero, impacto, servicios, casos de éxito, sobre mí, experiencia, proyectos, stack tecnológico, toolkit, FAQ, certificaciones y contacto) más un blog editorial con colección de contenido, feed RSS y sitemap generados en build.

El contenido vive en TypeScript tipado (`src/data`) y en una colección Markdown (`src/content/blog`), editable desde Pages CMS a través de `.pages.yml`. No hay backend, base de datos ni usuarios autenticados: todo se resuelve en compilación y se publica en GitHub Pages.

La documentación canónica para personas y agentes está en [`.ai/`](./.ai/); este README es el inventario de alto nivel del repositorio.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Astro | 7.4.11 | Framework estático, routing, content collections y endpoints |
| TypeScript | 6.0.3 | Tipado estricto en toda la base de código |
| Tailwind CSS | 4.3.5 | Instalado como plugin de Vite; el diseño real vive en `global.css` y no usa utilidades |
| PostCSS | 8.5.32 | Procesamiento CSS |
| `@astrojs/rss` | 4.0.19 | Generación del feed `/rss.xml` |
| Playwright | 1.63.0 | Suite E2E de 32 pruebas en Chromium/Chrome |
| Cloudinary | — | Hosting y transformación de imágenes (`f_auto,q_auto`) |
| FormSubmit | — | Servicio del formulario de contacto |
| Pages CMS | — | Edición del blog desde el panel, definida en `.pages.yml` |

Gestor de paquetes: **pnpm 12.18.0** (`packageManager`). CI usa Node.js 22.

## Estructura del Proyecto

```
├── .ai/                     # Documentación canónica (identidad, arquitectura, disciplina, decisiones)
│   ├── agents/              # Protocolo operativo y diferencias por herramienta
│   └── diagrams/            # Diagramas Mermaid de arquitectura, componentes, despliegue y flujo
├── .github/
│   └── workflows/
│       └── deploy-pages.yml # CI: check, tests, build, auditoría de referencias y deploy
├── public/                  # Assets copiados tal cual a la raíz de dist/
│   ├── .well-known/
│   │   └── security.txt     # RFC 9116 (idéntico a public/security.txt)
│   ├── assets/cv/           # CVs en PDF (ES/EN)
│   ├── _headers             # CSP, HSTS, Permissions-Policy y caché (hosts compatibles)
│   ├── apple-touch-icon.png # 180×180
│   ├── CNAME                # juan-samayoa.is-a.dev
│   ├── favicon.ico          # 256×256
│   ├── manifest.json        # Manifest PWA (duplicado de site.webmanifest)
│   ├── og-image.png         # Imagen 1200×630 usada por /thanks y /404
│   ├── robots.txt           # Crawlers + bloqueo de bots de IA + sitemap
│   ├── security.txt         # RFC 9116 en raíz
│   ├── site.webmanifest     # Manifest enlazado por el Layout
│   └── sw.js                # Service worker publicado, sin registrar
├── src/
│   ├── components/          # 13 componentes: 12 secciones + modal de certificaciones
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
│   │   ├── CertModal.astro
│   │   └── Contact.astro
│   ├── content/
│   │   └── blog/            # Artículos Markdown de la colección `blog`
│   ├── data/                # Contenido estructurado (TypeScript)
│   │   ├── personal.ts      # Datos personales, redes, foto y CVs
│   │   ├── projects.ts      # 5 proyectos con URLs de Cloudinary
│   │   └── certifications.ts # 22 certificaciones (9 destacadas + 13 adicionales)
│   ├── layouts/
│   │   └── Layout.astro     # Head SEO/CSP, nav, footer, RSS y scripts globales
│   ├── pages/
│   │   ├── index.astro      # Home con 12 secciones
│   │   ├── blog/index.astro # Índice del blog con filtro por tags
│   │   ├── blog/[slug].astro # Artículo: BlogPosting, portada, pie de acciones
│   │   ├── toolkit/sql.astro # SQL Validation Playground (5 ejemplos)
│   │   ├── thanks.astro     # Confirmación del formulario
│   │   ├── 404.astro        # Página de error
│   │   ├── rss.xml.ts       # Feed RSS dinámico desde la colección
│   │   └── sitemap.xml.ts   # Sitemap dinámico desde la colección
│   ├── styles/
│   │   └── global.css       # Sistema visual completo (tokens, secciones, responsive)
│   ├── types/
│   │   └── portfolio.ts     # PersonalInfo, Badge, Project, Certification
│   ├── utils/
│   │   └── cloudinary.ts    # Inserción de transformaciones f_auto,q_auto
│   ├── content.config.ts    # Esquema de la colección `blog`
│   └── env.d.ts
├── tests/                   # 32 pruebas E2E y 6 pruebas Node del comprobador de enlaces
├── tools/
│   └── check-local-references.mjs # Verifica referencias locales del HTML en dist/
├── .pages.yml               # Configuración de Pages CMS para el blog
├── AGENTS.md                # Punto de entrada documental (enruta a .ai/)
├── CLAUDE.md / CODEX.md     # Puntos de entrada por herramienta
├── astro.config.mjs         # site, base, outDir, seguridad y Vite
├── package.json             # Scripts, dependencias y packageManager
├── playwright.config.ts     # Preview en 5173, Chrome local / Chromium en CI
├── pnpm-workspace.yaml      # Overrides de seguridad y política minimumReleaseAge
├── tailwind.config.cjs      # Configuración mínima de Tailwind
└── tsconfig.json            # strict, bundler, esnext
```

## Rutas generadas

| Ruta | Archivo de origen | Indexable | JSON-LD |
|---|---|---|---|
| `/` | `src/pages/index.astro` | Sí | `Person` |
| `/blog/` | `src/pages/blog/index.astro` | Sí | `Blog` |
| `/blog/<slug>/` | `src/pages/blog/[slug].astro` | Sí | `BlogPosting` |
| `/toolkit/sql/` | `src/pages/toolkit/sql.astro` | No (`noindex, follow`) | `WebPage` |
| `/thanks/` | `src/pages/thanks.astro` | No | `WebPage` |
| `/404.html` | `src/pages/404.astro` | No | `WebPage` |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Endpoint | — |
| `/rss.xml` | `src/pages/rss.xml.ts` | Endpoint | — |

El sitemap se genera desde la colección `blog`: home (1.0), índice del blog (0.8) y una URL por artículo publicado (0.7, `lastmod` con la fecha de actualización). El feed respeta el mismo filtro de borradores y declara `<language>es-gt</language>`.

## Características

- **Rendimiento:** SSG sin hidratación, CSS y JS con hash, fuentes cargadas sin bloquear el render (`media="print"` + activación al `load`), `preconnect` a Google Fonts y Cloudinary, imágenes entregadas con `f_auto,q_auto` y dimensiones declaradas.
- **SEO:** metadatos por ruta, canónicas absolutas, Open Graph, Twitter Cards, JSON-LD (`Person`, `Blog`, `BlogPosting`, `WebPage`), sitemap dinámico, RSS con autodiscovery y `robots.txt` con bloqueo de crawlers de IA.
- **Seguridad:** CSP en `<meta>` y en `_headers` restringida a `self`, Cloudinary y FormSubmit; HSTS, `frame-ancestors 'none'`, `Permissions-Policy`, COEP `credentialless`, `security.checkOrigin` y honeypot en el formulario.
- **PWA:** manifests y service worker con estrategias Cache First / Network First / Stale While Revalidate; el worker está publicado pero **ninguna página lo registra**, por lo que hoy no hay caché offline activa.
- **Accesibilidad:** landmarks, skip-link bilingüe, menú móvil con `aria-expanded`, `<dialog>` con trampa de foco, `<details>` nativos, contraste AA, `prefers-reduced-motion` y contenido visible sin JavaScript.
- **Responsive:** mobile-first con breakpoints en 940 px, 640 px, 380 px y 360 px.
- **Contenido:** blog en Markdown con portada opcional, tags, borradores y filtro por tag en cliente; edición desde Pages CMS sin tocar código.
- **Calidad:** `astro check` + build + comprobador de referencias + 32 pruebas E2E como pasos bloqueantes del workflow.

## Seguridad

El proyecto incluye múltiples capas de protección:

- **CSP dual** — `<meta http-equiv="Content-Security-Policy">` en `Layout.astro` (efectiva en GitHub Pages) y cabecera en `public/_headers` (hosts compatibles), con `img-src` limitado a `https://res.cloudinary.com`.
- **`_headers`** — HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` extensa, COOP/CORP, COEP `credentialless` y caché por tipo de archivo.
- **`robots.txt`** — bloquea `/assets/cv/`, `/sw.js`, `/_headers`, `/security.txt` y a GPTBot, ChatGPT-User, CCBot, Google-Extended, anthropic-ai y ClaudeBot.
- **`security.txt`** — estándar RFC 9116 en `/security.txt` y `/.well-known/security.txt`.
- **Formulario** — FormSubmit con `_captcha`, honeypot `_honey` y redirect a `/thanks`; la CSP solo permite `form-action` hacia ese origen.
- **Service worker** — valida origen en mensajes, no cachea rutas sensibles y limita la caché dinámica a 50 entradas.

## Dependencias

Mínimas por diseño:

- **Runtime:** `astro` y `@astrojs/rss`.
- **Desarrollo:** `@astrojs/check`, `@playwright/test`, `@tailwindcss/postcss`, `@tailwindcss/vite`, `postcss`, `tailwindcss`, `typescript`.
- **Overrides de seguridad** en `pnpm-workspace.yaml` (`sharp`, `lodash`, `minimatch`, `ajv`, `sucrase`, `fast-uri`, `source-map-js`, `enhanced-resolve`) con política `minimumReleaseAge`.

## Autor

**Juan Samayoa** — QA Automation Engineer · Guatemala City
- [Portfolio](https://juan-samayoa.is-a.dev)
- [LinkedIn](https://www.linkedin.com/in/juansamayoa/)
- [GitHub](https://github.com/JuanSamayoa)
