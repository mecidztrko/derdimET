import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_DEV_PROXY_TARGET?.trim() || 'http://127.0.0.1:8080'

  return {
  plugins: [
    react(),
    {
      name: 'inject-auth-bg-css',
      transformIndexHtml(html) {
        return html.replace('</head>', '    <link rel="stylesheet" href="/auth/auth-bg-override.css" />\n  </head>')
      },
    },
  ],
  base: '/auth/',
  build: {
    outDir: '../src/main/resources/static/auth',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/login': { target: proxyTarget, changeOrigin: true },
      '/perform_login': { target: proxyTarget, changeOrigin: true },
      '/logout': { target: proxyTarget, changeOrigin: true },
      '/api': { target: proxyTarget, changeOrigin: true },
      '/profile': { target: proxyTarget, changeOrigin: true },
    },
  },
  }
})
