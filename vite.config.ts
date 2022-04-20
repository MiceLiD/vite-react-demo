import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), splitVendorChunkPlugin()],
  base: '/vite-react-demo/',
  resolve: {
    alias: {
      '@': path.join(__dirname, './src')
    }
  }
})
