import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ['favicon.svg'],
      manifest: false,
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/baiduApi': {
        target: 'http://api.fanyi.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baiduApi/, ''),
      }
    }
  }
})
