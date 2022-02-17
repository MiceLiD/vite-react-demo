import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  alias: {
    '@': path.join(__dirname, './client')
  },
  build: {
    outDir: 'docs',
    assetsDir: 'statics',
    rollupOptions: {
      input: path.resolve(__dirname, 'client/main.tsx')
    }
  }
})
