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
            src: '/src/assets/songPickerLogo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/src/assets/songPickerLogo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
        theme_color: '#9747FF',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
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
