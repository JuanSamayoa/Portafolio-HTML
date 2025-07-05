/**
 * BADGE UTILITIES - Utilidades centralizadas para badges de tecnologías
 * ==================================================================== 
 * Elimina duplicación de colores y lógica entre componentes
 * Aplicando principios DRY y mantenibilidad
 */

export interface BadgeColor {
  background: string;
  text: string;
  border: string;
}

// Mapeo centralizado de tecnologías a colores
export const TECHNOLOGY_COLORS: Record<string, BadgeColor> = {
  // Frontend Frameworks
  "react": {
    background: "bg-[#61DAFB]/10 dark:bg-[#61DAFB]/20",
    text: "text-[#149ECA] dark:text-[#61DAFB]",
    border: "border border-[#61DAFB]/30"
  },
  "angular": {
    background: "bg-[#DD0031]/10 dark:bg-[#DD0031]/20",
    text: "text-[#DD0031] dark:text-[#DD0031]",
    border: "border border-[#DD0031]/30"
  },
  "vue": {
    background: "bg-[#4FC08D]/10 dark:bg-[#4FC08D]/20",
    text: "text-[#4FC08D] dark:text-[#4FC08D]",
    border: "border border-[#4FC08D]/30"
  },
  
  // Languages
  "typescript": {
    background: "bg-[#3178C6]/10 dark:bg-[#3178C6]/20",
    text: "text-[#3178C6] dark:text-[#3178C6]",
    border: "border border-[#3178C6]/30"
  },
  "javascript": {
    background: "bg-[#F7DF1E]/10 dark:bg-[#F7DF1E]/20",
    text: "text-[#746A00] dark:text-[#F7DF1E]",
    border: "border border-[#F7DF1E]/30"
  },
  "python": {
    background: "bg-[#3776AB]/10 dark:bg-[#3776AB]/20",
    text: "text-[#3776AB] dark:text-[#3776AB]",
    border: "border border-[#3776AB]/30"
  },
  "java": {
    background: "bg-[#007396]/10 dark:bg-[#007396]/20",
    text: "text-[#007396] dark:text-[#007396]",
    border: "border border-[#007396]/30"
  },
  
  // Web Technologies
  "html": {
    background: "bg-[#E34F26]/10 dark:bg-[#E34F26]/20",
    text: "text-[#E34F26] dark:text-[#E34F26]",
    border: "border border-[#E34F26]/30"
  },
  "css": {
    background: "bg-[#1572B6]/10 dark:bg-[#1572B6]/20",
    text: "text-[#1572B6] dark:text-[#1572B6]",
    border: "border border-[#1572B6]/30"
  },
  "tailwind": {
    background: "bg-[#06B6D4]/10 dark:bg-[#06B6D4]/20",
    text: "text-[#06B6D4] dark:text-[#06B6D4]",
    border: "border border-[#06B6D4]/30"
  },
  
  // Tools & Databases
  "postman": {
    background: "bg-[#FF6C37]/10 dark:bg-[#FF6C37]/20",
    text: "text-[#FF6C37] dark:text-[#FF6C37]",
    border: "border border-[#FF6C37]/30"
  },
  "jira": {
    background: "bg-[#0052CC]/10 dark:bg-[#0052CC]/20",
    text: "text-[#0052CC] dark:text-[#0052CC]",
    border: "border border-[#0052CC]/30"
  },
  "selenium": {
    background: "bg-[#43B02A]/10 dark:bg-[#43B02A]/20",
    text: "text-[#43B02A] dark:text-[#43B02A]",
    border: "border border-[#43B02A]/30"
  },
  "sql": {
    background: "bg-[#4479A1]/10 dark:bg-[#4479A1]/20",
    text: "text-[#4479A1] dark:text-[#4479A1]",
    border: "border border-[#4479A1]/30"
  },
  "postgresql": {
    background: "bg-[#336791]/10 dark:bg-[#336791]/20",
    text: "text-[#336791] dark:text-[#336791]",
    border: "border border-[#336791]/30"
  },
  "sqlserver": {
    background: "bg-[#CC2927]/10 dark:bg-[#CC2927]/20",
    text: "text-[#CC2927] dark:text-[#CC2927]",
    border: "border border-[#CC2927]/30"
  },
  "oracle": {
    background: "bg-[#F80000]/10 dark:bg-[#F80000]/20",
    text: "text-[#F80000] dark:text-[#F80000]",
    border: "border border-[#F80000]/30"
  },
  "powerbi": {
    background: "bg-[#F2C811]/10 dark:bg-[#F2C811]/20",
    text: "text-[#7F6A00] dark:text-[#F2C811]",
    border: "border border-[#F2C811]/30"
  },
  
  // Additional tools and technologies
  "slack": {
    background: "bg-[#4A154B]/10 dark:bg-[#4A154B]/20",
    text: "text-[#4A154B] dark:text-[#4A154B]",
    border: "border border-[#4A154B]/30"
  },
  "xray": {
    background: "bg-[#971CEA]/10 dark:bg-[#971CEA]/20",
    text: "text-[#971CEA] dark:text-[#971CEA]",
    border: "border border-[#971CEA]/30"
  },
  "crm": {
    background: "bg-[#0078D4]/10 dark:bg-[#0078D4]/20",
    text: "text-[#0078D4] dark:text-[#0078D4]",
    border: "border border-[#0078D4]/30"
  },
  "nodejs": {
    background: "bg-[#339933]/10 dark:bg-[#339933]/20",
    text: "text-[#339933] dark:text-[#339933]",
    border: "border border-[#339933]/30"
  },
  "express": {
    background: "bg-[#000000]/10 dark:bg-[#ffffff]/20",
    text: "text-[#000000] dark:text-[#ffffff]",
    border: "border border-[#000000]/30 dark:border-[#ffffff]/30"
  }
};

// Color neutral por defecto
export const NEUTRAL_COLOR: BadgeColor = {
  background: "bg-gray-100 dark:bg-gray-700/70",
  text: "text-gray-800 dark:text-gray-300",
  border: "border border-gray-300/30 dark:border-gray-600/30"
};

/**
 * Obtiene las clases CSS para un badge basado en la tecnología
 * Función optimizada que reduce complejidad ciclomática
 */
export function getBadgeClasses(technology: string): string {
  const normalizedTech = technology.toLowerCase().replace(/\s+/g, '');
  const colors = TECHNOLOGY_COLORS[normalizedTech] ?? NEUTRAL_COLOR;
  
  return `${colors.background} ${colors.text} ${colors.border} text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors`;
}

/**
 * Verifica si una tecnología tiene colores personalizados
 */
export function hasTechnologyColor(technology: string): boolean {
  const normalizedTech = technology.toLowerCase().replace(/\s+/g, '');
  return normalizedTech in TECHNOLOGY_COLORS;
}
