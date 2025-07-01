// ==============================================
// CONFIGURACIÓN CENTRALIZADA DEL PORTAFOLIO
// ==============================================

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  profileImage: string;
  profileImageFallback: string;
  linkedin: string;
  github: string;
  cvPathEs: string;
  cvPathEn: string;
}

export interface Badge {
  text: string;
  color?: string;
}

export interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  location: string;
  description: string;
  badges: Badge[];
  isActive?: boolean;
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  tags: Badge[];
  link?: string;
  github?: string;
  featured?: boolean;
}

export interface Skill {
  category: string;
  technologies: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  image: string;
  date: string;
  link?: string; // Opcional - algunos certificados no tienen link de verificación
}

// ==============================================
// DATOS PERSONALES
// ==============================================
export const personalInfo: PersonalInfo = {
  name: "Juan Samayoa",
  title: "Ingeniero de Pruebas TI",
  email: "juancho1705@gmail.com",
  location: "Ciudad de Guatemala, Guatemala",
  profileImage: "/assets/img/profile.webp",
  profileImageFallback: "/assets/img/profile-fallback.webp",
  linkedin: "https://www.linkedin.com/in/juansamayoa/",
  github: "https://github.com/JuanSamayoa",
  cvPathEs: "/assets/cv-juan-samayoa-es.pdf",
  cvPathEn: "/assets/cv-juan-samayoa-en.pdf"
};

// ==============================================
// EXPERIENCIA PROFESIONAL
// ==============================================
export const experienceData: ExperienceItem[] = [
  {
    date: "Octubre 2024 - Presente",
    title: "Ingeniero de Pruebas TI I",
    company: "Conduent Business Services, Guatemala",
    location: "Ciudad de Guatemala",
    description: "Responsable de manejo de aplicativos para clientes farmacéuticos. Manejando Power BI, Oracle SQL, y automatizando dashboard con Python Selenium con un ahorro del 30% en tiempos de ejecución de pruebas.",
    badges: [
      { text: "Selenium" },
      { text: "Python" },
      { text: "Oracle SQL" },
      { text: "Power BI" },
    ],
    isActive: true,
  },
  {
    date: "Julio 2022 - Octubre 2024",
    title: "Analista Especializado QA",
    company: "Banco Industrial, S.A.",
    location: "Ciudad de Guatemala",
    description: "Responsable de las pruebas manuales para cliente interno de Agentes Bancarios. Automatizando un flujo completo con Postman Flows al 100%. Implementación de un 25% de automatización de procesos para QA manual.",
    badges: [
      { text: "Jira" }, 
      { text: "Postman" }, 
      { text: "X-Ray" }
    ],
  },
  {
    date: "Febrero 2024 - Octubre 2024",
    title: "Desarrollador Frontend (Paralelo)",
    company: "Banco Industrial, S.A.",
    location: "Ciudad de Guatemala",
    description: "Desarrollo de plataforma para Agentes Bancarios. Manejo de Angular, TypeScript y Tailwind para el desarrollo de la plataforma en móvil y desktop.",
    badges: [
      { text: "Angular" },
      { text: "HTML/CSS" },
      { text: "TypeScript" },
      { text: "Tailwind" },
    ],
  },
  {
    date: "Abril 2021 - Julio 2022",
    title: "Customer Resolution Expert",
    company: "Alorica Comunicaciones Limitada",
    location: "Ciudad de Guatemala",
    description: "Automatización de procesos para telefonía de EE.UU. Implementando respuestas automáticas, resolución al frontline, desbloqueo de dispositivos móviles, entre otros aspectos.",
    badges: [
      { text: "CRM" }, 
      { text: "Slack" }, 
      { text: "Python" }
    ],
  },
];

// ==============================================
// PROYECTOS DESTACADOS
// ==============================================
export const projectsData: Project[] = [
  {
    title: "Sistema de Recursos Humanos - Desktop",
    description: "Integra funciones como agregar empleados, modificación de los mismos, capacidad para dar vacaciones, solicitudes generales, permisos especiales, licencias de ley, además de generar reportes y con capacidad de perfilamiento.",
    image: "/assets/img/humanresources.webp",
    tags: [
      { text: "Java" },
      { text: "Microsoft SQL Server" },
      { text: "Swing" },
    ],
    featured: true,
    github: "https://github.com/JuanSamayoa/SistemaRecursosHumanos",
  },
  {
    title: "Plataforma de bodas (Frontend)",
    description: "Plataforma que incluye frontend, backend y base de datos para una visualización general del evento, así como enviar mensajes, asistencia, mapa del lugar, entre otros.",
    image: "/assets/img/wedding.webp",
    tags: [
      { text: "PostgreSQL" },
      { text: "Express JS" },
      { text: "Angular" },
      { text: "TypeScript" },
      { text: "Tailwind" },
      { text: "Node JS" },
    ],
    github: "https://github.com/JuanSamayoa/my-wedding-website",
  },
  {
    title: "Plataforma de bodas (Backend)",
    description: "Aplicación de backend desarrollada en NextJS, con peticiones a la base de datos PostgreSQL, autenticación y autorización de usuarios, así como un sistema de roles para la gestión de permisos.",
    image: "/assets/img/wedding-backend.webp",
    tags: [
      { text: "NextJS" }, 
      { text: "Automation" }, 
      { text: "CRM" }
    ],
    github: "https://github.com/JuanSamayoa/my-wedding-database",
  },
  {
    title: "Frontend de Gestión de Agentes",
    description: "Interfaz desarrollada en Angular para la gestión interna de agentes bancarios, venta de productos, colocación de tarjetas de débito, visualización de comisiones y módulo administrativo.",
    image: "/assets/img/agents.webp",
    tags: [
      { text: "Angular" }, 
      { text: "TypeScript" }, 
      { text: "Tailwind" }
    ],
  },
];

// ==============================================
// HABILIDADES TÉCNICAS
// ==============================================
export const skillsData: Skill[] = [
  {
    category: "QA & Testing",
    technologies: ["Selenium WebDriver", "Postman", "Jira", "X-Ray", "Python", "Oracle SQL"]
  },
  {
    category: "Frontend Development",
    technologies: ["Angular", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "JavaScript"]
  },
  {
    category: "Backend & Database",
    technologies: ["Java", "Node.js", "PostgreSQL", "Microsoft SQL Server", "Oracle SQL"]
  },
  {
    category: "Tools & Platforms",
    technologies: ["Power BI", "Git", "Slack", "CRM Systems", "Swing"]
  }
];

// ==============================================
// CERTIFICACIONES
// ==============================================

// Certificaciones más importantes (mostrar por defecto)
export const featuredCertifications: Certification[] = [
  {
    title: "Google Cloud Big Data and Machine Learning Fundamentals",
    issuer: "Google Cloud",
    image: "/assets/certificates/bigd-ml-fundamentals.webp",
    date: "2025",
    link: "https://www.coursera.org/account/accomplishments/verify/D6WTXV68PYIW",
  },
  {
    title: "Desarrollador Back-end",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/backend-developer.webp",
    date: "2020",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/733aade5-8999-4e04-ab9d-99d6d2c7af9f",
  },
  {
    title: "Desarrollador Front-end",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/frontend-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/e148298e-8c59-407e-b94d-3b4e5c1f2e68",
  },
  {
    title: "Diplomado en Fundamentos de Full Stack",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/full-stack-diploma.webp",
    date: "2025",
    link: "",
  },
  {
    title: "Scrum Foundations Professional Certificate",
    issuer: "CertiProf",
    image: "/assets/certificates/scrum-foundation.webp",
    date: "2022",
    link: "",
  },
  {
    title: "Entrenamiento Desarrollo Seguro",
    issuer: "DEVEL Cybersecurity",
    image: "/assets/certificates/secure-development.webp",
    date: "2023",
    link: "",
  },
  {
    title: "Programador en C#",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/csharp-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/0380b800-f5d2-4772-8eed-cae72d8bb8ed",
  },
  {
    title: "Introduction to Software Development de Amazon",
    issuer: "Coursera",
    image: "/assets/certificates/intro-software-development-amazon.webp",
    date: "2025",
    link: "https://www.coursera.org/account/accomplishments/verify/4BPJ0MYHZ4CS",
  },
];

// Todas las demás certificaciones
export const additionalCertifications: Certification[] = [
  {
    title: "Inglés Nivel 12 (Requerido técnico)",
    issuer: "Centro de Aprendizaje de Lenguas de la Universidad de San Carlos de Guatemala (CALUSAC)",
    image: "/assets/certificates/calusac-level-twelve.webp",
    date: "2020",
    link: "",
  },
  {
    title: "Introducción a la Programación",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/programming-intro.webp",
    date: "2020",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/2a9700f4-20fc-43e3-93e7-6f2a5230fd6b",
  },
  {
    title: "Programador (Orientado a Objetos)",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/oo-programmer.webp",
    date: "2020",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/35ff7d58-16f7-42b7-a266-1085d60a6d2f",
  },
  {
    title: "Administrador de Servidores",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/server-admin.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/c673879b-b843-4d7f-a224-54f69fd3e481",
  },
  {
    title: "Preprocesadores de estilos",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/styles-preprocessors.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/b28ee1ba-fb77-4cb6-ba1a-036a30e58851",
  },
  {
    title: "Postprocesadores de estilos",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/styles-postprocessor.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/d55c5d3c-e9e1-4b70-b04c-05b0664648c3",
  },
  {
    title: "Diseñador de experiencia de usuario (UX)",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/ux-designer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/65528ffe-22c1-4c2d-9768-0ec5b06516cf",
  },
  {
    title: "Desarrollador de sitios web responsivos",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/responsive-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/edb7e15b-e5ab-40a4-8e6d-eaf12e45d7aa",
  },
  {
    title: "Desarrollador de interfaces gráficas",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/ui-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/5516ffb6-2731-499b-9137-5053281840c9",
  },
  {
    title: "Control de versiones (git)",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/version-control.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/aef99b6c-491a-4e01-841e-87513e10b1b6",
  },
  {
    title: "Cómputo básico",
    issuer: "Capacitate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/basic-computing.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/0380b800-f5d2-4772-8eed-cae72d8bb8ed",
  },
];

// Para compatibilidad con el componente actual
export const certificationsData: Certification[] = [
  ...featuredCertifications,
  ...additionalCertifications
];

// ==============================================
// CONFIGURACIÓN GENERAL
// ==============================================
export const siteConfig = {
  title: "Portafolio de Juan Samayoa - QA y Desarrollador / Programador Junior",
  description: "Portafolio de Juan Samayoa, QA y Desarrollador Junior. Con experiencia en pruebas de software y desarrollo web.",
  url: "https://juan-samayoa.is-a.dev",
  locale: "es",
  analytics: {
    googleAnalytics: "G-XXXXXXXXXX" // Agregar tu ID cuando tengas
  }
};
