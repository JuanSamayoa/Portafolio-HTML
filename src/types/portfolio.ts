// ==============================================
// TIPOS DE DATOS DEL PORTAFOLIO
// ==============================================
// Interfaces y tipos TypeScript centralizados

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

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
