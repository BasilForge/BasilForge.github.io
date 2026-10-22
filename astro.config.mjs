// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://basilforge.github.io',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: { prefixDefaultLocale: false },
  },
});
