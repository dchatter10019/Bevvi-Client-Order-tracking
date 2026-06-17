/**
 * Parses a customer markdown file into a config object.
 *
 * Supports full design-system documents: brand tokens are extracted from
 * `--color-*` / `--font-*` CSS variable blocks and the `**Company:**` line,
 * while operational settings come from these sections:
 *
 *   ## Monitor Settings   (- id:, - tagline:, - logo:, - favicon:, color overrides)
 *   ## Order Statuses     (- 0: Pending ...)
 *   ## Status Pipeline    (- Pending ...)
 *
 * The older simple format (## Identity / ## Branding / ## Statuses / ## Pipeline)
 * still parses.
 */

const SECTION_ALIASES = {
  identity: 'settings',
  branding: 'settings',
  'monitor settings': 'settings',
  statuses: 'statuses',
  'order statuses': 'statuses',
  pipeline: 'pipeline',
  'status pipeline': 'pipeline'
}

const IDENTITY_KEYS = new Set(['id', 'tagline', 'title', 'label', 'hostname'])

const HEX = '#[0-9A-Fa-f]{3,8}'

function findToken(markdown, name) {
  const match = markdown.match(new RegExp(`--${name}:\\s*(${HEX})`))
  return match ? match[1] : ''
}

function findFont(markdown, name) {
  const match = markdown.match(new RegExp(`--font-${name}:\\s*'([^']+)'`))
  return match ? match[1] : ''
}

export function parseCustomerConfig(markdown) {
  const lines = markdown.split(/\r?\n/)

  const config = {
    label: '',
    identity: {},
    branding: {},
    statuses: {},
    pipeline: []
  }

  let h1 = ''
  let section = ''

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    if (line.startsWith('# ') && !line.startsWith('## ') && !h1) {
      h1 = line
        .slice(2)
        .replace(/\s*[—–-]+\s*Design System.*$/i, '')
        .trim()
      continue
    }

    const companyMatch = line.match(/^\*\*Company:\*\*\s*(.+)$/)
    if (companyMatch) {
      config.label = companyMatch[1].trim()
      continue
    }

    if (line.startsWith('## ')) {
      section = SECTION_ALIASES[line.slice(3).trim().toLowerCase()] || ''
      continue
    }

    if (!section || !line.startsWith('- ')) continue
    const item = line.slice(2).trim()

    if (section === 'pipeline') {
      config.pipeline.push(item)
      continue
    }

    const colonIdx = item.indexOf(':')
    if (colonIdx === -1) continue

    const key = item.slice(0, colonIdx).trim().toLowerCase()
    // Strip trailing parenthesized comments, e.g. "Pending  (initial state)"
    const value = item
      .slice(colonIdx + 1)
      .replace(/\s+\([^)]*\)\s*$/, '')
      .trim()

    if (section === 'statuses') {
      const code = Number(key)
      if (!Number.isNaN(code)) config.statuses[code] = value
    } else if (IDENTITY_KEYS.has(key)) {
      config.identity[key] = value
    } else if (key === 'hostnames') {
      config.identity.hostnames = value.split(/[,;\s]+/).map((h) => h.trim()).filter(Boolean)
    } else {
      config.branding[key] = value
    }
  }

  if (!config.label) config.label = h1

  // Design-system token extraction (fills anything not set explicitly)
  config.tokens = {
    primary: findToken(markdown, 'color-primary'),
    primaryDark: findToken(markdown, 'color-primary-dark'),
    primaryLight: findToken(markdown, 'color-primary-light'),
    navy: findToken(markdown, 'color-navy'),
    offWhite: findToken(markdown, 'color-off-white'),
    fontBody: findFont(markdown, 'body'),
    fontDisplay: findFont(markdown, 'display')
  }

  return config
}

/** Validates and normalizes a parsed config. Returns null if unusable. */
export function normalizeCustomerConfig(config, sourceName = '') {
  const id = config.identity.id || sourceName.replace(/\.md$/i, '').replace(/-design-system$/i, '')
  if (!id) {
    console.warn(`Customer config ${sourceName} is missing "id" — skipped.`)
    return null
  }

  const tokens = config.tokens || {}
  const label = config.identity.label || config.label || id
  const primary = config.branding.primary || tokens.primary || '#e11d48'

  const shadeOverrides = Object.fromEntries(
    Object.entries(config.branding)
      .filter(([key]) => /^primary-\d{2,3}$/.test(key))
      .map(([key, value]) => [key.split('-')[1], value])
  )
  if (tokens.primaryDark && !shadeOverrides['700']) shadeOverrides['700'] = tokens.primaryDark
  if (tokens.primaryLight && !shadeOverrides['100']) shadeOverrides['100'] = tokens.primaryLight

  const hostnames = [
    config.identity.hostname,
    ...(config.identity.hostnames || [])
  ]
    .map((h) => h?.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0])
    .filter(Boolean)

  return {
    id,
    label,
    hostnames,
    tagline: config.identity.tagline || '',
    title: config.identity.title || `${label} Order Monitor`,
    logo: config.branding.logo || '/bevvi-logo.png',
    favicon: config.branding.favicon || '',
    colors: {
      primary,
      accent: config.branding.accent || primary,
      sidebar: config.branding.sidebar || tokens.navy || '#000000',
      canvas: config.branding.canvas || tokens.offWhite || ''
    },
    fonts: {
      body: config.branding['font-body'] || tokens.fontBody || '',
      display: config.branding['font-display'] || tokens.fontDisplay || ''
    },
    shadeOverrides,
    statuses: config.statuses,
    pipeline: config.pipeline
  }
}
