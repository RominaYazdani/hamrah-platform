import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// HAMRAH — GitHub Pages Configuration
export default defineConfig({
  plugins: [react()],
  base: '/hamrah-platform/',
})