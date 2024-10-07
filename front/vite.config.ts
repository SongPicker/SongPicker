import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      manifest: {
        name: 'songPicker',
        short_name: 'songPicker',
        icons: [
          {
            src: '/icons/apple-touch-icon-57x57.png',
            sizes: '57x57',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-60x60.png',
            sizes: '60x60',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-76x76.png',
            sizes: '76x76',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-114x114.png',
            sizes: '114x114',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-120x120.png',
            sizes: '120x120',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: '/icons/favicon-196x196.png',
            sizes: '196x196',
            type: 'image/png',
          },
        ],
        theme_color: '#9747FF',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
      injectRegister: null,
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Firebase 메시징 서비스 워커와의 충돌 방지
        navigateFallback: null,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',

  server: {
    headers: {
      'Service-Worker-Allowed': '/',
    },
    proxy: {
      '/api': {
        target: 'https://songpicker.kro.kr',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        'main': path.resolve(__dirname, 'index.html'),
        'firebase-messaging-sw': path.resolve(__dirname, 'public/firebase-messaging-sw.js'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }
            return 'vendor';
          }
        },
      },
    },
  },

  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
}));
