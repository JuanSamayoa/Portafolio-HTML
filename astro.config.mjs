// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://juan-samayoa.is-a.dev',
  base: '/',
  build: {
    assets: 'assets',
  },
  vite: {
    build: {
      assetsInlineLimit: 0, // Evita la incrustación inline de assets pequeños
    },
  },
});
