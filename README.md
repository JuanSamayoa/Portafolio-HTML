# Portafolio de Juan Samayoa | QA & Desarrollo Web

![Astro Badge](https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=fff&style=flat)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

## 📋 Acerca de este proyecto

Portafolio profesional desarrollado con **Astro** y **Tailwind CSS**, diseñado para mostrar mi experiencia como Ingeniero de Pruebas TI y desarrollador web. El sitio presenta una arquitectura moderna, optimizada para rendimiento y SEO, con un sistema de componentes reutilizables y un design system consistente.

### ✨ Características técnicas

- **Framework**: Astro 4.x con generación estática optimizada
- **Estilos**: Tailwind CSS con design system personalizado
- **Componentes**: Arquitectura Atomic Design (átomos, moléculas, organismos)
- **Tipado**: TypeScript para mayor robustez y mantenibilidad
- **Responsive Design**: Mobile-first con breakpoints optimizados
- **Modo claro/oscuro**: Implementación nativa con persistencia local
- **Animaciones**: CSS3 y transiciones suaves para UX mejorada
- **SEO**: Meta tags, Open Graph y estructura semántica optimizada
- **PWA**: Manifest y iconos para instalación como aplicación web
- **Accesibilidad**: ARIA labels, navegación por teclado y contraste optimizado

### 🎨 Design System

- **Tipografía**: Inter como fuente principal para máxima legibilidad
- **Colores**: Paleta consistente con variables CSS personalizadas
- **Componentes**: Badge system con colores específicos por tecnología
- **Espaciado**: Sistema de spacing basado en Tailwind con customizaciones
- **Animaciones**: Micro-interacciones y estados hover consistentes

### 🏗️ Arquitectura del proyecto

```
src/
├── components/
│   ├── atoms/           # Componentes básicos (Button, Text, Badge)
│   ├── molecules/       # Componentes compuestos (SectionContainer)
│   └── organisms/       # Secciones completas (Header, Hero, Projects)
├── data/
│   └── portfolio.ts     # Datos centralizados del portafolio
├── layouts/
│   └── Layout.astro     # Layout base con SEO y PWA
├── pages/
│   └── index.astro      # Página principal
├── styles/
│   └── global.css       # Estilos globales y variables CSS
└── utils/
    ├── getTechColor.ts  # Utilidad para colores de tecnologías
    └── validation.ts    # Validaciones de formularios
```

### 🚀 Tecnologías y herramientas

- **Build**: Astro con optimizaciones de producción
- **Estilos**: Tailwind CSS con configuración personalizada
- **Iconos**: Lucide Icons para consistencia visual
- **Deployment**: GitHub Actions con deploy automático a GitHub Pages
- **Dominio**: Configuración para dominio personalizado (juan-samayoa.is-a.dev)
- **Análisis**: Estructura preparada para Google Analytics

### 📊 Características del contenido

- **Secciones organizadas**: Hero, Sobre mí, Experiencia, Proyectos, Certificaciones, Contacto
- **CV multiidioma**: Selector de CV en español e inglés
- **Certificaciones**: Sistema de "Ver más" para mostrar certificaciones destacadas
- **Proyectos**: Cards interactivas con tecnologías y enlaces
- **Experiencia**: Timeline profesional con detalles técnicos
- **Contacto**: Enlaces directos a redes sociales y email

### 🔧 Optimizaciones implementadas

- **Performance**: Lazy loading de imágenes y componentes
- **SEO**: Sitemap automático y meta tags dinámicos
- **Accesibilidad**: Navegación por teclado y screen readers
- **Mobile**: Diseño mobile-first con navegación adaptativa
- **Carga**: Optimización de assets y minificación automática

## 🌐 Sitio en vivo

**URL**: [https://juan-samayoa.is-a.dev](https://juan-samayoa.is-a.dev)

---

Desarrollado por Juan Samayoa | Ingeniero de Pruebas TI & Desarrollador Web
