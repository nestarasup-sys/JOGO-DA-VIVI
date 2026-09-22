import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['favicon.svg'],manifest:{name:'Entre Nós: Aurora',short_name:'Aurora',description:'Visual novel original',theme_color:'#130f1d',background_color:'#0e0b15',display:'standalone'}})],build:{target:'es2022',sourcemap:true,chunkSizeWarningLimit:1500}});
