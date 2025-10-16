// ==============================================
// UTILIDADES GENERALES
// ==============================================

/**
 * Capitaliza la primera letra de un string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formatea una fecha en español
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Trunca texto con ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

/**
 * Genera un ID único simple
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Deep clone de objetos (simple)
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Verifica si un objeto está vacío
 */
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (typeof obj === "string" || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
};

/**
 * Delay para operaciones asíncronas
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Agrupa array de objetos por propiedad
 */
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Ordena array por múltiples criterios
 */
export const sortBy = <T>(
  array: T[],
  ...criteria: Array<(item: T) => any>
): T[] => {
  return [...array].sort((a, b) => {
    for (const criterion of criteria) {
      const aVal = criterion(a);
      const bVal = criterion(b);

      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
};
