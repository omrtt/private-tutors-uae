import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'خصوصي - منصة المدرسين الخصوصيين في الإمارات',
        short_name: 'خصوصي',
        description: 'أفضل المدرسين الخصوصيين في الإمارات - ابحث، قارن، واحجز بسهولة',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#10b981',
        background_color: '#f8fafc',
        lang: 'ar',
        dir: 'rtl',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    allowedHosts: ['private-tutors-uae.loca.lt', '.loca.lt'],
    proxy: { '/api': 'http://localhost:5000' },
  },
});
