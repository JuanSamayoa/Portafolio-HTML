// @ts-check
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://juan-samayoa.is-a.dev",
  base: "/",
  outDir: "./dist",

  // Configuración de seguridad
  security: {
    checkOrigin: true,
  },

  // Configuración simplificada
  // `compressHTML` se deja en su valor por defecto: es el que produce el
  // markup más compacto (fijarlo a `true` conserva espacios entre nodos).
  build: {
    assets: "assets",
    // Inlinea solo las hojas pequeñas; global.css queda como archivo cacheable.
    inlineStylesheets: "auto",
  },

  vite: {
    plugins: [tailwind()],
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
