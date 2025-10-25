// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: "https://juan-samayoa.is-a.dev",
  base: "/", // Usar raíz para rutas absolutas
  outDir: "./docs", // Mantener el directorio de salida para GitHub Pages

  // Configuración de imágenes remotas
  image: {
    domains: ["coursera.org", "capacitateparaelempleo.org"],
  },

  // Configuración de seguridad
  security: {
    checkOrigin: true,
  },

  // Configuración simplificada
  build: {
    assets: "assets",
  },

  vite: {
    build: {
      assetsInlineLimit: 0, // Evitar la incrustación inline de assets pequeños
      // Configuraciones de seguridad para el build
      rollupOptions: {
        output: {
          // Sanitizar nombres de archivos
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
      // Configuraciones de seguridad para desarrollo
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
    },
  },
});
