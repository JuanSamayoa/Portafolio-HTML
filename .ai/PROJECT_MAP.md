# PROJECT_MAP — Mapa del repositorio

## Objetivo

Ofrecer un mapa completo y navegable del repositorio: árbol de carpetas, propósito de cada directorio, dependencias entre módulos y componentes críticos.

## Alcance

Estructura de archivos versionados (`git ls-files`: 47 archivos) y carpetas locales relevantes. No documenta el contenido interno de `node_modules` ni de `dist`.

## Árbol completo

```
Portafolio-HTML/
├── .ai/                              # Documentación para agentes (este conjunto)
│   ├── agents/                       # Instrucciones por herramienta
│   └── diagrams/                     # Diagramas Mermaid
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # CI/CD: build + deploy a GitHub Pages
├── .vscode/                          # Local, ignorado por git
├── .astro/                           # Generado por Astro (ignorado)
├── dist/                             # Salida del build (ignorada, 28 archivos)
├── node_modules/                     # Dependencias (ignorado)
├── public/                           # Assets copiados tal cual a la raíz de dist/
│   ├── .nojekyll                     # Desactiva Jekyll en GitHub Pages
│   ├── .well-known/
│   │   └── security.txt              # RFC 9116 (idéntico a public/security.txt)
│   ├── assets/
│   │   └── cv/
│   │       ├── cv-juan-samayoa-es.pdf
│   │       └── cv-juan-samayoa-en.pdf
│   ├── CNAME                         # juan-samayoa.is-a.dev
│   ├── _headers                      # Headers para hosts compatibles (no GitHub Pages)
│   ├── apple-touch-icon.png          # 180x180 real (manifests declaran 192x192)
│   ├── favicon.ico                   # 256x256
│   ├── manifest.json                 # PWA manifest (duplicado)
│   ├── og-image.png                  # 1200x630 aprox.; no referenciado por las páginas
│   ├── robots.txt                    # Reglas + bloqueo de crawlers de IA
│   ├── security.txt                  # RFC 9116 en raíz
│   ├── site.webmanifest              # PWA manifest enlazado por el Layout
│   ├── sitemap.xml                   # Solo la home
│   └── sw.js                         # Service worker publicado, no registrado
├── scripts/                          # LOCAL, ignorado por git
│   ├── deploy-github.ps1
│   └── deploy-github.sh
├── src/
│   ├── components/                   # 13 componentes Astro
│   │   ├── About.astro               # Sobre mí + proceso QA
│   │   ├── Cases.astro               # 2 casos de éxito
│   │   ├── CertModal.astro           # Modal <dialog> de certificaciones
│   │   ├── Certifications.astro      # Grid destacadas + <details> adicionales
│   │   ├── Contact.astro             # Formulario FormSubmit + enlaces + CVs
│   │   ├── Experience.astro          # Timeline de 5 roles
│   │   ├── Faq.astro                 # 7 <details> con preguntas
│   │   ├── Hero.astro                # Portada + tarjeta terminal + métricas
│   │   ├── Impact.astro              # 4 métricas de impacto
│   │   ├── Projects.astro            # Grid de proyectos desde datos
│   │   ├── Services.astro            # 4 servicios
│   │   ├── Skills.astro              # 4 categorías de stack
│   │   └── Toolkit.astro             # 4 recursos descargables
│   ├── data/
│   │   ├── certifications.ts         # 22 certificaciones + vistas derivadas
│   │   ├── personal.ts               # Datos personales, redes, CVs
│   │   └── projects.ts               # 5 proyectos
│   ├── layouts/
│   │   └── Layout.astro              # Head SEO/seguridad + nav + footer + scripts
│   ├── pages/
│   │   ├── 404.astro                 # Página de error
│   │   ├── index.astro               # Home: composición de 12 secciones
│   │   ├── thanks.astro              # Confirmación de formulario
│   │   └── toolkit/
│   │       └── sql.astro             # SQL Validation Playground (5 ejemplos)
│   ├── styles/
│   │   └── global.css                # Sistema visual completo
│   ├── types/
│   │   └── portfolio.ts              # PersonalInfo, Badge, Project, Certification
│   └── env.d.ts                      # Referencias de tipos de Astro
├── .gitignore
├── README.md                         # Descripción general (parcialmente desactualizada)
├── astro.config.mjs                  # site, base, outDir, security, Vite
├── package.json                      # Scripts, deps, overrides, packageManager
├── pnpm-lock.yaml
├── tailwind.config.cjs               # Config mínima (no define el diseño)
└── tsconfig.json                     # strict, bundler, esnext
```

## Propósito de cada directorio

| Directorio | Propósito | Se versiona | Se publica |
|---|---|---|---|
| `.ai/` | Fuente de verdad documental para agentes | Sí | No |
| `.github/workflows/` | Automatización de build y despliegue | Sí | No |
| `public/` | Assets estáticos y archivos de control del hosting | Sí | Sí, copiados a la raíz |
| `src/components/` | Presentación por sección, sin lógica de negocio | Sí | Compilado |
| `src/data/` | Contenido estructurado y tipado | Sí | Compilado |
| `src/layouts/` | Shell HTML, SEO, seguridad y comportamiento global | Sí | Compilado |
| `src/pages/` | Routing por archivos | Sí | Genera HTML |
| `src/styles/` | Sistema visual único | Sí | CSS con hash |
| `src/types/` | Contratos TypeScript | Sí | No |
| `scripts/` | Utilidades locales de despliegue manual | **No** (`.gitignore`) | No |
| `dist/` | Artefacto de build | No | Es lo que se publica |
| `.astro/` | Tipos generados | No | No |

## Dependencias entre módulos

```mermaid
flowchart TD
    IDX["pages/index.astro"] --> LAY["layouts/Layout.astro"]
    THX["pages/thanks.astro"] --> LAY
    NF["pages/404.astro"] --> LAY
    SQL["pages/toolkit/sql.astro"] --> LAY
    SQL --> PER

    IDX --> HERO & IMP & SRV & CAS & ABT & EXP & PRJ & SKL & TKL & FAQ & CERT & CON

    HERO --> PER
    CON --> PER
    TKL --> PER
    PRJ --> PER
    PRJ --> PRJD["data/projects.ts"]
    CERT --> CERTS["data/certifications.ts"]
    CERT --> MODAL["components/CertModal.astro"]

    PER["data/personal.ts"] --> TYPES["types/portfolio.ts"]
    PRJD --> TYPES
    CERTS --> TYPES

    LAY --> CSS["styles/global.css"]
```

## Dependencias de build y runtime

| Tipo | Elemento | Notas |
|---|---|---|
| Runtime npm | `astro` | Única dependencia de producción |
| Dev npm | `@astrojs/check`, `@tailwindcss/postcss`, `@tailwindcss/vite`, `postcss`, `tailwindcss`, `typescript` | Compilación, tipos y pipeline CSS |
| Runtime navegador | APIs nativas | `IntersectionObserver`, `requestAnimationFrame`, `navigator.clipboard`, `Blob`, `<dialog>`, `<details>` |
| Externas | Cloudinary, Google Fonts, FormSubmit | Sin fallback local |

## Componentes críticos

| Componente | Criticidad | Motivo |
|---|---|---|
| `src/layouts/Layout.astro` | Muy alta | SEO, CSP, navegación, footer y scripts globales en un solo archivo |
| `src/pages/index.astro` | Alta | Orden narrativo de las 12 secciones y metadatos de la home |
| `src/styles/global.css` | Alta | Todo el diseño; un error afecta a las 4 páginas |
| `src/data/personal.ts` | Alta | Contacto, redes, foto y CVs; alimenta también `security.txt` conceptualmente |
| `src/components/Contact.astro` | Alta | Único formulario y canal principal de conversión |
| `src/components/Certifications.astro` + `CertModal.astro` | Media-alta | Acoplamiento por `CustomEvent("open-cert-modal")`; accesibilidad por teclado |
| `src/data/certifications.ts` | Media | `category` omitido ⇒ certificación invisible |
| `src/pages/toolkit/sql.astro` | Media | 617 líneas con datos, markup, scripts y estilos encapsulados |
| `astro.config.mjs` | Media | `site`, `base`, hashes de assets y cabeceras de desarrollo |
| `public/_headers`, `public/sw.js` | Media | Seguridad y caché; fáciles de desincronizar |
| `.github/workflows/deploy-pages.yml` | Alta | Único camino de publicación |

## Archivos referenciados que no existen

| Referencia | Origen | Estado |
|---|---|---|
| `/toolkit/playwright-quick-start.pdf` | `src/components/Toolkit.astro` | Ausente en `public/` |
| `/favicon.svg` | `thanks.astro`, `404.astro` (`previewImage`) | Ausente; solo existe `favicon.ico` |
| `public/assets/img/`, `public/assets/icons/` | `README.md`, `sw.js` (patrones de caché) | No existen |
| `deploy-github.ps1` / `.sh` en raíz | `README.md` | Viven en `scripts/`, ignorado por git |

## Reglas

- Un archivo nuevo debe tener un propósito claro y ubicarse en el directorio que corresponde a su capa.
- No se versionan artefactos (`dist/`, `.astro/`) ni dependencias.
- Los cambios en `public/` se publican tal cual: no hay compilación ni validación.
- Toda referencia a un asset debe poder resolverse dentro de `public/`.

## Ejemplos reales

- Cadena de import típica: `pages/index.astro` → `components/Projects.astro` → `data/projects.ts` → `types/portfolio.ts`.
- Un proyecto nuevo se añade solo en `src/data/projects.ts`; `Projects.astro` lo renderiza sin cambios.
- Referencia huérfana real: `Toolkit.astro` apunta a `/toolkit/playwright-quick-start.pdf`, que no existe en `public/toolkit/`.
- Archivo ignorado pero presente: `scripts/deploy-github.sh` no aparece en `git ls-files`.

## Riesgos conocidos

- `src/pages/toolkit/sql.astro` concentra 5 responsabilidades (datos, SEO, markup, comportamiento, estilos) y es el archivo con mayor coste de mantenimiento.
- `global.css` es un único punto de fallo visual para todo el sitio.
- `Layout.astro` mezcla SEO, seguridad y comportamiento; tocarlo tiene efecto transversal.
- La carpeta `scripts/` genera confusión: existe, parece parte del proyecto, no está versionada.

## Recomendaciones futuras

- Extraer los ejemplos SQL a `src/data/sql-examples.ts` para alinear la página con el principio de separación datos/presentación.
- Dividir `global.css` por secciones solo si el tamaño sigue creciendo, manteniendo un único punto de entrada.
- Eliminar o documentar formalmente `scripts/` para evitar ambigüedad operativa.
- Resolver las referencias huérfanas listadas arriba.
