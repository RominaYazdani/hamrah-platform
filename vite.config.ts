
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// HAMRAH — GitHub Pages & PWA Configuration
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'pwa-192.png',
        'pwa-512.png',
      ],

      manifest: {
        name: 'HAMRAH — Good Company, When You Need It',
        short_name: 'HAMRAH',
        description:
          'A human-centered companionship service designed around your everyday needs.',

        start_url: '/hamrah-platform/',
        scope: '/hamrah-platform/',
        display: 'standalone',

        background_color: '#FAFAF7',
        theme_color: '#102B3F',

        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        navigateFallback: '/hamrah-platform/index.html',
      },
    }),
  ],

  base: '/hamrah-platform/',
})
