# Portafolio v2.0.0 | Juan Samayoa

## Acerca de este proyecto

Portafolio web personal desarrollado con Astro y TypeScript, enfocado en rendimiento y experiencia de usuario. Presenta una arquitectura limpia basada en features, sistema de temas dark/light, y efectos visuales modernos con glassmorphism.

## Estructura del Proyecto

```
src/
├── core/              # Configuración central (theme tokens)
├── data/              # Datos del portafolio (personal, projects, experience)
├── features/          # Componentes por funcionalidad
│   ├── about/
│   ├── contact/
│   ├── experience/
│   ├── hero/
│   └── projects/
├── layouts/           # Layout principal
├── pages/             # Páginas de Astro
├── shared/            # Componentes compartidos (UI, animations)
└── types/             # Definiciones TypeScript
```

## Stack Tecnológico

- Astro 5.15.1
- TypeScript 5.9.3
- Tailwind CSS 3.4.1
- pnpm 10.19.0

### Características Técnicas

- Static site generation (SSG)
- Sistema de temas dark/light con CSS variables
- Glassmorphism y efectos visuales modernos
- Animaciones optimizadas con Intersection Observer
- Diseño responsive mobile-first
- TypeScript strict mode
- SEO optimizado

## Características del Diseño

### Sistema de Colores

- Brand: #0066ff (azul principal)
- Success: #00cc66 (verde acento)
- Backgrounds: Oscuros en dark mode, claros en light mode
- Glass effects: Transparencias con backdrop-blur

### Componentes Principales

- Header: Navegación fixed con glassmorphism
- Hero: Sección de introducción con gradientes
- Experience: Timeline de experiencia laboral
- Projects: Grid de proyectos con tecnologías
- Contact: Formulario y datos de contacto

### Animaciones

- Smooth scroll
- Fade in on scroll
- Pulse effects
- Gradient animations
- Scale transforms

## Configuración

Los datos del portafolio se encuentran en `src/data/`:

- `personal.ts`: Información personal y contacto
- `experience.ts`: Historial laboral
- `projects.ts`: Proyectos destacados
- `skills.ts`: Habilidades técnicas
- `certifications.ts`: Certificaciones

## Deployment

El sitio se construye automáticamente en la carpeta `docs/` y se despliega via GitHub Pages.

URL del sitio: https://juan-samayoa.is-a.dev

## Performance

Métricas objetivo:

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Build time: ~2s

## Licencia

Todos los derechos reservados - Juan Samayoa 2025
