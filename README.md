# Portafolio de Juan Samayoa | QA & Desarrollo Web

![Astro Badge](https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=fff&style=flat)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

## 📋 Acerca de este proyecto

Portafolio profesional desarrollado con **Astro** y **Tailwind CSS**, diseñado para mostrar mi experiencia como Especialista en QA y desarrollador web. El sitio presenta una arquitectura moderna optimizada para rendimiento, con componentes refactorizados siguiendo principios Clean Code y un sistema de optimización de imágenes avanzado.

### ✨ Características técnicas

- **Framework**: Astro 5.x con generación estática optimizada
- **Estilos**: Tailwind CSS con design system personalizado y variables CSS
- **Arquitectura**: Atomic Design refactorizada (átomos, moléculas, organismos)
- **Tipado**: TypeScript estricto con interfaces y utilidades centralizadas
- **Optimización de imágenes**: Sistema avanzado con soporte WebP y retina
- **Responsive Design**: Mobile-first con breakpoints optimizados
- **Modo claro/oscuro**: Implementación nativa con persistencia local
- **Animaciones**: CSS3 y micro-interacciones suaves para UX premium
- **SEO**: Meta tags, Open Graph y estructura semántica optimizada
- **PWA**: Manifest y iconos para instalación como aplicación web
- **Accesibilidad**: ARIA labels, navegación por teclado y contraste WCAG AA

### 🎨 Design System

- **Tipografía**: Onest como fuente principal optimizada para legibilidad web
- **Colores**: Paleta adaptativa con variables CSS y soporte completo de temas
- **Componentes**: Sistema de badges dinámico con colores específicos por tecnología
- **Espaciado**: Sistema de spacing coherente basado en Tailwind
- **Iconos**: Lucide Icons con renderizado optimizado y accesibilidad
- **Animaciones**: Micro-interacciones consistentes y estados hover fluidos

### 🏗️ Arquitectura del proyecto

```
src/
├── components/
│   ├── atoms/              # Componentes básicos reutilizables
│   │   ├── Button.astro    # Botones con variantes y estados
│   │   ├── Text.astro      # Tipografía consistente
│   │   ├── Badge.astro     # Badges de tecnologías
│   │   └── CVSelector.astro # Selector de CV multiidioma
│   ├── molecules/          # Componentes compuestos
│   │   └── SectionContainer.astro # Contenedor de secciones
│   └── organisms/          # Secciones completas optimizadas
│       ├── Header.astro    # Navegación responsive
│       ├── Hero.astro      # Hero con imagen optimizada
│       ├── Projects.astro  # Grid de proyectos
│       ├── Certifications.astro # Sistema de certificaciones
│       └── Contact.astro   # Formulario con validación refactorizada
├── data/
│   └── portfolio.ts        # Datos organizados cronológicamente
├── layouts/
│   └── Layout.astro        # Layout base con PWA y SEO
├── pages/
│   └── index.astro         # Página principal optimizada
├── utils/
│   ├── imageUtils.ts       # Utilidades de optimización de imágenes
│   ├── getTechColor.ts     # Sistema de colores de tecnologías
│   └── validation.ts       # Validaciones centralizadas
└── styles/
    └── global.css          # Estilos globales y custom properties
```

### 🚀 Tecnologías y herramientas

- **Build**: Astro 5.x con optimizaciones avanzadas de producción
- **Estilos**: Tailwind CSS con configuración personalizada y design tokens
- **Optimización**: Sistema de imágenes WebP con soporte retina y lazy loading
- **Iconos**: Lucide Icons con tree-shaking y renderizado optimizado
- **Deployment**: Generación estática optimizada para GitHub Pages
- **Dominio**: Configuración para dominio personalizado con CDN
- **Performance**: Core Web Vitals optimizados y caching inteligente

### 📊 Características del contenido

- **Organización intuitiva**: Hero, Sobre mí, Experiencia, Proyectos, Certificaciones, Contacto
- **CV multiidioma**: Selector dinámico de CV en español e inglés con descarga directa
- **Sistema de certificaciones**: Certificaciones destacadas y adicionales ordenadas cronológicamente
- **Proyectos interactivos**: Cards responsivas con tecnologías, descripción y enlaces funcionales
- **Timeline profesional**: Experiencia laboral con detalles técnicos y logros cuantificables
- **Contacto optimizado**: Formulario con validación JavaScript y enlaces sociales

### 🔧 Optimizaciones implementadas

#### Performance y UX
- **Imágenes**: Sistema automatizado de optimización WebP con fallbacks
- **Lazy loading**: Carga diferida de componentes e imágenes pesadas
- **Responsive images**: Soporte para pantallas retina y diferentes densidades
- **CSS crítico**: Inline de estilos críticos y carga asíncrona de no críticos

#### Code Quality y Mantenibilidad
- **Clean Code**: Refactorización siguiendo principios SOLID y DRY
- **Utilidades centralizadas**: Eliminación de duplicación de código
- **TypeScript estricto**: Tipado fuerte y interfaces bien definidas
- **Componentes reutilizables**: Arquitectura modular y escalable

#### SEO y Accesibilidad
- **Semántica HTML5**: Estructura correcta para screen readers
- **Meta tags dinámicos**: Open Graph y Twitter Cards optimizados
- **Navegación por teclado**: Accesibilidad completa sin mouse
- **Contraste WCAG**: Cumplimiento de estándares de accesibilidad

#### Seguridad Web
- **Content Security Policy**: Protección contra XSS y injection de scripts
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **Security.txt**: Política de divulgación responsable de vulnerabilidades
- **HTTPS Enforcement**: Strict Transport Security habilitado

## 🌐 Sitio en vivo

**URL**: [https://juan-samayoa.is-a.dev](https://juan-samayoa.is-a.dev)

---

Desarrollado por Juan Samayoa | Especialista en QA & Desarrollador Web Jr.
