# MISSION — Misión, alcance y criterios de éxito

## Objetivo

Establecer para qué existe el proyecto, a quién sirve y cómo se reconoce que está cumpliendo su función, de forma que un agente pueda evaluar si un cambio aporta o desvía.

## Alcance

Describe el "para qué" del producto. No describe implementación (ver `ARCHITECTURE.md`) ni estilo (ver `STANDARDS.md`).

## Misión

Dar a **Juan Samayoa**, QA Automation Engineer en Ciudad de Guatemala, una presencia web profesional propia que:

1. **Comunique posicionamiento** como especialista en calidad de software (QA manual, automatización, validación de datos y APIs).
2. **Demuestre evidencia**, no solo afirme capacidades: casos de éxito con problema/solución/resultado, proyectos con enlaces a código, certificaciones verificables y un toolkit descargable.
3. **Convierta visitantes en conversaciones**: formulario de contacto, email directo, LinkedIn, GitHub y descarga de CV en español e inglés.
4. **Sea indexable y compartible** en buscadores y redes (Open Graph, Twitter Cards, JSON-LD, sitemap, `robots.txt`).
5. **Funcione sin infraestructura propia ni coste de servidor**: sitio estático servido desde GitHub Pages.

### Evidencia de la misión en el código

| Objetivo | Implementación observada |
|---|---|
| Posicionamiento | Hero con "QA Automation Engineer / Software Quality Specialist", subtítulo de stack y ubicación (`src/components/Hero.astro`) |
| Evidencia | 2 casos de éxito, 5 proyectos, 22 certificaciones, 5 ejemplos SQL (`Cases.astro`, `projects.ts`, `certifications.ts`, `toolkit/sql.astro`) |
| Conversión | Formulario FormSubmit con redirect a `/thanks`, `mailto:`, LinkedIn, GitHub y 2 CVs (`Contact.astro`, `personal.ts`) |
| Descubribilidad | Metadatos completos por página, JSON-LD `Person`/`WebPage`, `sitemap.xml`, `robots.txt` (`Layout.astro`, `src/pages/*`) |
| Coste cero de servidor | Build estático + GitHub Pages (`astro.config.mjs`, `.github/workflows/deploy-pages.yml`) |

## Audiencias

| Audiencia | Qué busca | Dónde se atiende |
|---|---|---|
| Reclutadores técnicos | Rol, stack, años de experiencia, CV descargable | Hero, Impacto, Experiencia, Habilidades, Contacto |
| Hiring managers / líderes QA | Evidencia de impacto y criterio de prueba | Impacto, Casos de éxito, FAQ, Toolkit |
| Clientes potenciales (freelance/consultoría) | Servicios, disponibilidad, forma de trabajo | Servicios, Sobre mí, FAQ, Contacto |
| Pares técnicos | Proyectos, código, consultas SQL reales | Proyectos, Stack, SQL Playground |

## Criterios de éxito

Los criterios que el código **permite verificar**:

- Las 4 rutas construyen sin errores (`pnpm build`: `/`, `/thanks`, `/toolkit/sql`, `/404.html`).
- `pnpm check` termina sin errores.
- El visitante puede contactar por al menos 3 vías independientes (formulario, email, LinkedIn) y descargar CV en 2 idiomas.
- Toda certificación renderizada tiene emisor, fecha e imagen; las que tienen URL muestran "verificar".
- La home expone 12 secciones navegables por anclas.
- El dominio propio está declarado en `public/CNAME`; la aplicación de HTTPS depende de la configuración de GitHub Pages (PENDIENTE DE DEFINICIÓN).

Criterios que **no** pueden verificarse con el repositorio y quedan como `PENDIENTE DE DEFINICIÓN`:

- Número de visitas, conversiones o candidaturas generadas (no hay analítica instalada; se verificó ausencia de `gtag`, `analytics`, `plausible`, `umami`).
- Posicionamiento real en buscadores.
- Tasa de respuesta del formulario (depende de FormSubmit y del correo destino, gestionado fuera del repositorio).
- Objetivo comercial declarado (tiempo completo, freelance, consultoría) más allá de lo que dice el copy.

## No objetivos (derivados de la ausencia de implementación)

No son requisitos rechazados formalmente, sino límites observados del alcance actual:

- Blog, artículos o CMS.
- Autenticación, cuentas o área privada.
- Comercio electrónico o pagos.
- Multi-idioma con enrutamiento (`/en`, `/es`); solo hay copy bilingüe puntual.
- Panel de administración o base de datos.
- Analítica, cookies de seguimiento o personalización.

## Reglas

- Todo cambio debe poder justificarse contra uno de los cinco puntos de la misión.
- Un cambio que no sirve a ninguna audiencia identificada es, por defecto, fuera de alcance.
- No se añaden funcionalidades "porque son interesantes"; el sitio es una vitrina, no un laboratorio.
- El contenido publicado debe ser verificable o explícitamente presentado como experiencia profesional del autor.

## Ejemplos reales

- Añadir un caso de éxito nuevo **sí** sirve a la misión: alimenta `Cases.astro` y demuestra impacto.
- Añadir un modo oscuro **puede** servir a la misión (percepción de calidad), pero implica trabajo transversal de tokens y no hay evidencia de que se haya decidido; debe tratarse como propuesta.
- Añadir comentarios o "likes" en proyectos **no** sirve a la misión: requiere backend y no aporta a ninguna audiencia.

## Riesgos conocidos

- **Dependencia de un solo canal de contacto crítico:** el formulario usa un endpoint público de FormSubmit; si el servicio cambia o el correo destino se desactiva, se pierden leads sin señal en el sitio.
- **Evidencia estática y no auditable:** las métricas numéricas del hero e impacto no tienen fuente en el repositorio.
- **Certificaciones sin enlace público:** varias tienen `link: ""` y se muestran como "sin link público", lo que reduce la prueba social.
- **Contenido envejecido:** fechas de experiencia y certificaciones requieren actualización manual; no hay automatización ni recordatorios.

## Recomendaciones futuras

- Definir por escrito el objetivo comercial prioritario y ajustar el copy del hero y el CTA principal en consecuencia.
- Instrumentar una analítica mínima y respetuosa con la privacidad (previa aprobación y con CSP actualizada) para poder medir conversión.
- Establecer una cadencia de revisión de contenido (experiencia, certificaciones, CVs, `security.txt`).
- Incorporar enlaces de verificación a las certificaciones que hoy no los tienen, si el emisor los ofrece.
