import { resolve } from 'path'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: './src',
  publicDir: resolve(__dirname, 'public'),
  base: '/particle-based-fluid-simulation/',
  plugins: [glsl(), tsconfigPaths()],
  server: {
    host: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    target: 'esnext',
    emptyOutDir: true,
  },
})
