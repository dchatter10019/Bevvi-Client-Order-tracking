import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { injectVersionPatch } from './scripts/versionPatchScript.js'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

function versionPatchPlugin() {
  return {
    name: 'bevvi-version-patch',
    transformIndexHtml(html) {
      return injectVersionPatch(html, pkg.version)
    }
  }
}

export default defineConfig({
  plugins: [react(), versionPatchPlugin()],
  server: {
    port: 3002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
