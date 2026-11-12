import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * URL absoluta do site, exigida pelos scrapers de link (WhatsApp, Facebook,
 * LinkedIn) — eles não resolvem caminhos relativos na og:image.
 * Na Vercel vem pronta do ambiente; local cai no servidor de desenvolvimento.
 */
function urlDoSite() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:5173';
}

const injetarUrl = () => ({
  name: 'flytrade-url-do-site',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', urlDoSite()),
});

export default defineConfig({
  plugins: [react(), injetarUrl()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
