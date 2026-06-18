#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const indexPath = join(root, 'dist', 'index.html')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

if (!existsSync(indexPath)) {
  console.error('dist/index.html not found — run npm run build first.')
  process.exit(1)
}

const html = readFileSync(indexPath, 'utf8')
const checks = [
  ['bevvi-version-patch script', html.includes('id="bevvi-version-patch"')],
  ['bevvi-app-version meta', html.includes(`content="${pkg.version}"`)],
  ['hashed JS asset', /\/assets\/index-[^"]+\.js/.test(html)]
]

let failed = false
for (const [label, ok] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${label}`)
  if (!ok) failed = true
}

if (failed) {
  process.exit(1)
}

console.log(`\nBuild ready (v${pkg.version}). Copy the entire dist/ folder to your nginx web root:`)
console.log('  rsync -av --delete dist/ /var/www/ordertracker/')
console.log('\nVerify live site after deploy:')
console.log('  curl -s https://your-host/ | grep bevvi-version-patch')
