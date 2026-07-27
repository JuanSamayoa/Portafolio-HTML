// ==============================================
// CERTIFICACIONES
// ==============================================

import type { Certification } from "../types/portfolio";

// Catálogo unificado de certificaciones con tipo discriminado (DRY)
export const allCertificationsData: Certification[] = [
  // Destacadas
  {
    title: "Google Cloud Big Data and Machine Learning Fundamentals",
    issuer: "Google Cloud",
    image: "/assets/certificates/bigd-ml-fundamentals.webp",
    date: "2025",
    link: "https://www.coursera.org/account/accomplishments/verify/D6WTXV68PYIW",
    category: "featured",
  },
  {
    title: "Introduction to Software Development de Amazon",
    issuer: "Coursera",
    image: "/assets/certificates/intro-software-development-amazon.webp",
    date: "2025",
    link: "https://www.coursera.org/account/accomplishments/verify/4BPJ0MYHZ4CS",
    category: "featured",
  },
  {
    title: "Programming with Java de Amazon",
    issuer: "Coursera",
    image: "/assets/certificates/programming-with-java.webp",
    date: "2025",
    link: "https://www.coursera.org/account/accomplishments/verify/Y7NC7ONZC56K",
    category: "featured",
  },
  {
    title: "Desarrollador Back-end",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/backend-developer.webp",
    date: "2020",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/733aade5-8999-4e04-ab9d-99d6d2c7af9f",
    category: "featured",
  },
  {
    title: "Desarrollador Front-end",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/frontend-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/e148298e-8c59-407e-b94d-3b4e5c1f2e68",
    category: "featured",
  },
  {
    title: "Diplomado en Fundamentos de Full Stack",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/full-stack-diploma.webp",
    date: "2025",
    link: "",
    category: "featured",
  },
  {
    title: "Scrum Foundations Professional Certificate",
    issuer: "CertiProf",
    image: "/assets/certificates/scrum-foundation.webp",
    date: "2022",
    link: "",
    category: "featured",
  },
  {
    title: "Programador en C#",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/csharp-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/0380b800-f5d2-4772-8eed-cae72d8bb8ed",
    category: "featured",
  },
  // Adicionales (2020)
  {
    title: "Inglés Nivel 12 (Requerido técnico)",
    issuer:
      "Centro de Aprendizaje de Lenguas de la Universidad de San Carlos de Guatemala (CALUSAC)",
    image: "/assets/certificates/calusac-level-twelve.webp",
    date: "2020",
    link: "",
    category: "additional",
  },
  {
    title: "Introducción a la Programación",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/programming-intro.webp",
    date: "2020",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/2a9700f4-20fc-43e3-93e7-6f2a5230fd6b",
    category: "additional",
  },
  {
    title: "Programador (Orientado a Objetos)",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/oo-programmer.webp",
    date: "2020",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/35ff7d58-16f7-42b7-a266-1085d60a6d2f",
    category: "additional",
  },
  // 2023
  {
    title: "Entrenamiento Desarrollo Seguro",
    issuer: "DEVEL Cybersecurity",
    image: "/assets/certificates/secure-development.webp",
    date: "2023",
    link: "",
    category: "additional",
  },
  // 2025
  {
    title: "Administrador de Servidores",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/server-admin.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/c673879b-b843-4d7f-a224-54f69fd3e481",
    category: "additional",
  },
  {
    title: "Cómputo básico",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/basic-computing.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/0380b800-f5d2-4772-8eed-cae72d8bb8ed",
    category: "additional",
  },
  {
    title: "Control de versiones (git)",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/version-control.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/aef99b6c-491a-4e01-841e-87513e10b1b6",
    category: "additional",
  },
  {
    title: "Desarrollador de interfaces gráficas",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/ui-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/5516ffb6-2731-499b-9137-5053281840c9",
    category: "additional",
  },
  {
    title: "Desarrollador de sitios web responsivos",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/responsive-developer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/edb7e15b-e5ab-40a4-8e6d-eaf12e45d7aa",
    category: "additional",
  },
  {
    title: "Diseñador de experiencia de usuario (UX)",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/ux-designer.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/65528ffe-22c1-4c2d-9768-0ec5b06516cf",
    category: "additional",
  },
  {
    title: "Postprocesadores de estilos",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/styles-postprocessor.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/d55c5d3c-e9e1-4b70-b04c-05b0664648c3",
    category: "additional",
  },
  {
    title: "Preprocesadores de estilos",
    issuer: "Capacítate para el Empleo / Fundación Carlos Slim",
    image: "/assets/certificates/styles-preprocessors.webp",
    date: "2025",
    link: "https://capacitateparaelempleo.org/verifica/5b432ce5-1d22-4d92-9bcb-15564ee310b6/b28ee1ba-fb77-4cb6-ba1a-036a30e58851",
    category: "additional",
  },
];

// Vistas derivadas seguras (Clean Code / DRY)
export const featuredCertifications: Certification[] = allCertificationsData.filter(
  (cert) => cert.category === "featured"
);

export const additionalCertifications: Certification[] = allCertificationsData.filter(
  (cert) => cert.category === "additional"
);

export const certificationsData: Certification[] = allCertificationsData;
