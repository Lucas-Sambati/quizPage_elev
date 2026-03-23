import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './public'),
    },
  },
  // Configuração para GitHub Pages
  // Altere 'hipertrofia' para o nome do seu repositório
  base: process.env.VITE_BASE_PATH || '/hipertrofia/',
})
