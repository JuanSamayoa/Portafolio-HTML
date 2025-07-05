/**
 * IMAGE UTILITIES - Utilidades para manejo optimizado de imágenes
 * ==============================================================
 * Funciones para mejorar rendimiento y experiencia de usuario
 */

/**
 * Configuración de imágenes optimizadas
 */
export interface ImageConfig {
  src: string;
  fallback: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  lossless?: boolean; // Nueva opción para compresión sin pérdida
  adaptiveQuality?: boolean; // Ajuste automático de calidad
}

/**
 * Genera atributos optimizados para imágenes
 */
export function getOptimizedImageProps(config: ImageConfig) {
  const { src, fallback, alt, width, height, loading = 'lazy', lossless = false } = config;
  
  return {
    src,
    alt,
    width,
    height,
    loading,
    onError: `this.src='${fallback}'; this.onerror=null;`,
    style: width && height ? `aspect-ratio: ${width}/${height}` : undefined,
    'data-lossless': lossless.toString() // Metadata para procesamiento futuro
  };
}

/**
 * Opciones avanzadas de optimización de imagen
 */
export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  quality?: number;
  lossless?: boolean;
  progressive?: boolean;
  adaptiveQuality?: boolean;
}

/**
 * Detecta si una imagen puede beneficiarse de recompresión
 */
export function shouldRecompress(imagePath: string, options: ImageOptimizationOptions = {}): boolean {
  const ext = imagePath.split('.').pop()?.toLowerCase();
  const { lossless = false, adaptiveQuality = true } = options;
  
  // Casos donde vale la pena recomprimir
  const recompressScenarios = [
    ext === 'png' && !lossless, // PNG a WebP puede dar grandes ahorros
    ext === 'jpg' && adaptiveQuality, // JPEG puede optimizarse mejor
    ext === 'jpeg' && adaptiveQuality,
    ext === 'webp' && lossless && !imagePath.includes('lossless'), // WebP lossy a lossless
  ];
  
  return recompressScenarios.some(Boolean);
}

/**
 * Genera URL de imagen con parámetros de optimización inteligente
 */
export function getImageUrl(path: string, options: ImageOptimizationOptions = {}): string {
  if (!options || Object.keys(options).length === 0) return path;
  
  const { 
    width, 
    height, 
    format = 'auto', 
    quality, 
    lossless = false,
    progressive = true,
    adaptiveQuality = true 
  } = options;
  
  const params = new URLSearchParams();
  
  // Parámetros básicos
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  
  // Lógica inteligente de formato
  if (format === 'auto') {
    // Detectar mejor formato basado en el archivo original
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext === 'png' && !lossless) {
      params.set('f', 'webp');
    } else if (ext === 'webp' && lossless) {
      params.set('f', 'webp');
      params.set('lossless', '1');
    } else if (['jpg', 'jpeg'].includes(ext || '')) {
      params.set('f', 'webp');
      if (progressive) params.set('progressive', '1');
    }
  } else if (format) {
    params.set('f', format);
    if (format === 'webp' && lossless) {
      params.set('lossless', '1');
    }
  }
  
  // Calidad adaptativa
  if (quality !== undefined) {
    params.set('q', quality.toString());
  } else if (adaptiveQuality) {
    // Calidad inteligente basada en el tipo de imagen
    const ext = path.split('.').pop()?.toLowerCase();
    if (lossless) {
      params.set('q', '100');
    } else if (path.includes('certificate') || path.includes('cert')) {
      params.set('q', '95'); // Certificados necesitan alta calidad
    } else if (['jpg', 'jpeg'].includes(ext || '')) {
      params.set('q', '85'); // Balance para fotos
    } else {
      params.set('q', '90'); // Por defecto
    }
  }
  
  // Optimizaciones adicionales
  if (progressive && !lossless) params.set('progressive', '1');
  
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Preload de imágenes críticas para mejorar LCP
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Intersection Observer para lazy loading manual
 */
export function createImageObserver(callback: (entries: IntersectionObserverEntry[]) => void) {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback para navegadores sin soporte
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    };
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '100px',
    threshold: 0.1
  });
}

/**
 * Configuración optimizada para certificados (requiere alta calidad)
 */
export function getCertificateImageConfig(
  imagePath: string, 
  title: string,
  options: Partial<ImageOptimizationOptions> = {}
): ImageConfig {
  const { width = 192, height = 192, lossless = false } = options;
  
  return {
    src: getImageUrl(imagePath, {
      width,
      height,
      format: 'auto',
      lossless,
      adaptiveQuality: true,
      progressive: true
    }),
    fallback: imagePath,
    alt: title,
    width,
    height,
    loading: 'lazy',
    lossless,
    adaptiveQuality: true
  };
}

/**
 * Configuración optimizada para imagen de perfil principal (máxima calidad)
 */
export function getProfileImageConfig(
  imagePath: string, 
  name: string,
  options: Partial<ImageOptimizationOptions> = {}
): ImageConfig {
  const { width = 600, height = 600, lossless = true } = options;
  
  return {
    src: getImageUrl(imagePath, {
      width,
      height,
      format: 'auto',
      quality: 98, // Calidad muy alta para imagen principal
      lossless,
      adaptiveQuality: false, // Usar calidad fija alta
      progressive: true
    }),
    fallback: imagePath,
    alt: `Foto de perfil de ${name}`,
    width,
    height,
    loading: 'eager', // Carga prioritaria
    lossless,
    adaptiveQuality: false
  };
}

/**
 * Configuración optimizada para proyectos (balance calidad/tamaño)
 */
export function getProjectImageConfig(
  imagePath: string, 
  title: string,
  options: Partial<ImageOptimizationOptions> = {}
): ImageConfig {
  const { width = 400, height = 225, lossless = false } = options;
  
  return {
    src: getImageUrl(imagePath, {
      width,
      height,
      format: 'auto',
      quality: 85,
      lossless,
      adaptiveQuality: true,
      progressive: true
    }),
    fallback: imagePath,
    alt: `Imagen del proyecto ${title}`,
    width,
    height,
    loading: 'lazy',
    lossless,
    adaptiveQuality: true
  };
}
