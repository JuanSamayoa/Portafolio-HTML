// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://juan-samayoa.is-a.dev',
  base: '/',  // Usar raíz para rutas absolutas
  outDir: './docs',  // Mantener el directorio de salida para GitHub Pages
  // Configuración simplificada
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      assetsInlineLimit: 0 // Evitar la incrustación inline de assets pequeños
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  }
});
