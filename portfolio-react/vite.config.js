import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // Set base if deploying to GitHub Pages under a repo path
  base: '/mukul_joshi/'
})
