import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/**/*'],
      manifest: {
        name: 'Entre Nós: Aurora — V3 Ultra',
        short_name: 'Aurora V3',
        description: 'Visual novel romântica original com rotas, celular, mapa, eventos e editor.',
        theme_color: '#17121f',
        background_color: '#0c0912',
        display: 'standalone',
        orientation: 'landscape'
      }
    })
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 1200
  }
});
