#!/usr/bin/env node
/**
 * Interactive customer selector for dev/build.
 *
 * Lists every customers/*.md config and asks which company this run is for.
 * The choice is written to .env.local as VITE_CUSTOMER for local dev simulation.
 * Production resolves the customer from the hostname:
 *   https://<customer>.ordertracker.getbevvi.com
 *
 * Non-interactive runs (CI, agents): skipped — the existing .env.local wins.
 * Skip manually with SKIP_CUSTOMER_PROMPT=1.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const customersDir = join(root, 'customers')
const envFile = join(root, '.env.local')

function listCustomers() {
  return readdirSync(customersDir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .map((file) => {
      const raw = readFileSync(join(customersDir, file), 'utf8')
      const id =
        raw.match(/^- id:\s*(.+)$/m)?.[1]?.trim() ||
        file.replace(/\.md$/i, '').replace(/-design-system$/i, '')
      const label =
        raw.match(/^\*\*Company:\*\*\s*(.+)$/m)?.[1]?.trim() ||
        raw.match(/^# (.+)$/m)?.[1]?.replace(/\s*[—–-]+\s*Design System.*$/i, '').trim() ||
        id
      return { id, label }
    })
    .sort((a, b) => a.label.localeCompare(b.label))
}

function currentSelection() {
  if (!existsSync(envFile)) return undefined
  return readFileSync(envFile, 'utf8').match(/^VITE_CUSTOMER=(.*)$/m)?.[1]?.trim()
}

function writeSelection(id) {
  let content = existsSync(envFile) ? readFileSync(envFile, 'utf8') : ''
  if (/^VITE_CUSTOMER=.*$/m.test(content)) {
    content = content.replace(/^VITE_CUSTOMER=.*$/m, `VITE_CUSTOMER=${id}`)
  } else {
    content += `${content && !content.endsWith('\n') ? '\n' : ''}VITE_CUSTOMER=${id}\n`
  }
  writeFileSync(envFile, content)
}

const customers = listCustomers()

if (customers.length === 0) {
  console.error('No customer configs found in customers/*.md')
  process.exit(1)
}

const interactive = process.stdin.isTTY && process.stdout.isTTY && !process.env.SKIP_CUSTOMER_PROMPT

if (!interactive) {
  const selected = currentSelection()
  const label = selected
    ? customers.find((c) => c.id === selected)?.label || selected
    : 'All customers (switchable)'
  console.log(`Customer: ${label} (non-interactive — using saved selection)`)
  process.exit(0)
}

console.log('\nWhich company is this build for?\n')
console.log('  0) All customers (switchable in-app)')
customers.forEach((c, i) => console.log(`  ${i + 1}) ${c.label} (${c.id})`))

const saved = currentSelection()
const savedLabel = saved
  ? customers.find((c) => c.id === saved)?.label || saved
  : 'All customers'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

rl.question(`\nSelect [Enter = ${savedLabel}]: `, (answer) => {
  rl.close()
  const trimmed = answer.trim()

  if (trimmed === '') {
    console.log(`→ ${savedLabel}\n`)
    process.exit(0)
  }

  const index = Number(trimmed)
  if (index === 0) {
    writeSelection('')
    console.log('→ All customers (switchable in-app)\n')
    process.exit(0)
  }

  const chosen = customers[index - 1]
  if (!chosen) {
    console.error(`Invalid selection "${trimmed}".`)
    process.exit(1)
  }

  writeSelection(chosen.id)
  console.log(`→ ${chosen.label} (white-label: ${chosen.id})\n`)
  process.exit(0)
})
