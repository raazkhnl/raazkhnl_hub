import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  // The site is served from the root of the custom domain (khanalrajesh.com.np),
  // so assets resolve from `/` in both dev and build. GitHub Pages still serves
  // the repo URL `raazkhnl.github.io/raazkhnl_hub/` and 301-redirects it to the
  // custom domain once the CNAME is in place.
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
}));
