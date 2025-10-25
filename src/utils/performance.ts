/**
 * PERFORMANCE UTILITIES
 * Funciones para optimizar la carga y rendimiento del sitio
 */

/**
 * Preload de recursos críticos
 */
export function preloadCriticalResources(): void {
  if (typeof window === "undefined") return;

  const criticalResources = [{ href: "/assets/img/profile.jpg", as: "image" }];

  criticalResources.forEach(({ href, as }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
}

/**
 * Lazy load de imágenes usando Intersection Observer
 */
export function setupLazyLoading(): void {
  if (typeof window === "undefined" || !("IntersectionObserver" in window))
    return;

  const images = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.01,
    }
  );

  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Prefetch de recursos que se cargarán después
 */
export function prefetchResources(urls: string[]): void {
  if (typeof window === "undefined") return;

  urls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Reportar Web Vitals a la consola (útil para debugging)
 */
export function reportWebVitals(): void {
  if (typeof window === "undefined") return;

  // LCP - Largest Contentful Paint
  if ("PerformanceObserver" in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log("LCP:", lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      // Silently fail if not supported
    }
  }
}
