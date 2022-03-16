import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  base: '/vite-react-demo',
  resolve: {
    alias: {
      '@': path.join(__dirname, './client')
    }
  }
})
