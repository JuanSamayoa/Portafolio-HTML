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
  linkedin: string;
  github: string;
  cvPathEs: string;
  cvPathEn: string;
}

export interface Badge {
  text: string;
  color?: string;
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

export type CertificationCategory = "featured" | "additional";

export interface Certification {
  title: string;
  issuer: string;
  image: string;
  date: string;
  link?: string;
  category?: CertificationCategory;
}
