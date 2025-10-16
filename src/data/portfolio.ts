// ==============================================
// CONFIGURACIÓN CENTRALIZADA DEL PORTAFOLIO
// ==============================================
// Archivo principal que re-exporta todos los datos y tipos

import type { Project, Skill, Certification } from "../types/portfolio";

// Re-exportar tipos
export type {
  PersonalInfo,
  Badge,
  ExperienceItem,
  Project,
  Skill,
  Certification,
  SocialLink,
} from "../types/portfolio";

// Re-exportar datos
export { personalInfo } from "./personal";
export { experienceData } from "./experience";
export { projectsData } from "./projects";
export { skillsData } from "./skills";
export {
  featuredCertifications,
  additionalCertifications,
  certificationsData,
} from "./certifications";
export { siteConfig } from "./config";
export { CONSTANTS } from "./constants";
