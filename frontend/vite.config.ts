import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['disasterai.svg'],
      manifest: {
        name: 'DisasterAI - Your Intelligent Safety Companion',
        short_name: 'DisasterAI',
        description: 'Offline-first disaster preparedness resources and safety planning.',
        theme_color: '#193c38',
        background_color: '#f1f4f1',
        display: 'standalone',
        start_url: '/',
        icons: [{ src: '/disasterai.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        runtimeCaching: [],
      },
    }),
  ],
  server: {
    proxy: { '/api': { target: process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000', changeOrigin: true } },
  },
})
