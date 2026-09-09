import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use root in dev; repo subpath only for production builds
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: { port: 5173 },
  base: mode === 'production' ? '/mukul_joshi/' : '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['src/setupTests.js'],
    globals: true,
    css: true
  }
}))
