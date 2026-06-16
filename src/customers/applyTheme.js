/** Converts hex to [r, g, b]. Supports #rgb and #rrggbb. */
function hexToRgb(hex) {
  let value = hex.replace('#', '').trim()
  if (value.length === 3) {
    value = value.split('').map((c) => c + c).join('')
  }
  const num = parseInt(value, 16)
  if (Number.isNaN(num) || value.length !== 6) return null
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function mix([r1, g1, b1], [r2, g2, b2], amount) {
  return [
    Math.round(r1 + (r2 - r1) * amount),
    Math.round(g1 + (g2 - g1) * amount),
    Math.round(b1 + (b2 - b1) * amount)
  ]
}

const WHITE = [255, 255, 255]
const BLACK = [15, 15, 18]

/** WCAG relative luminance (0–1). */
function luminance([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

/**
 * Generates a Tailwind-style 50–900 shade scale from a single base color
 * (treated as the 600 shade) by mixing toward white and black.
 */
function generateShades(baseRgb) {
  return {
    50: mix(baseRgb, WHITE, 0.94),
    100: mix(baseRgb, WHITE, 0.88),
    200: mix(baseRgb, WHITE, 0.75),
    300: mix(baseRgb, WHITE, 0.58),
    400: mix(baseRgb, WHITE, 0.38),
    500: mix(baseRgb, WHITE, 0.16),
    600: baseRgb,
    700: mix(baseRgb, BLACK, 0.18),
    800: mix(baseRgb, BLACK, 0.36),
    900: mix(baseRgb, BLACK, 0.52)
  }
}

const FONT_LINK_ID = 'customer-theme-fonts'

/** Loads theme fonts from Google Fonts and sets --font-body / --font-display. */
function applyFonts(fonts = {}) {
  const root = document.documentElement

  if (fonts.body) {
    root.style.setProperty('--font-body', `'${fonts.body}', 'Inter', system-ui, sans-serif`)
  } else {
    root.style.removeProperty('--font-body')
  }

  if (fonts.display) {
    root.style.setProperty('--font-display', `'${fonts.display}', Georgia, serif`)
  } else {
    root.style.removeProperty('--font-display')
  }

  const families = [fonts.body, fonts.display]
    .filter(Boolean)
    .map((name) => `family=${name.trim().replace(/\s+/g, '+')}:wght@300;400;500;600;700`)

  const existing = document.getElementById(FONT_LINK_ID)
  if (!families.length) {
    existing?.remove()
    return
  }

  const href = `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
  if (existing) {
    if (existing.href !== href) existing.href = href
    return
  }

  const link = document.createElement('link')
  link.id = FONT_LINK_ID
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

/** Applies a customer config to the document: CSS variables, favicon, title. */
export function applyTheme(config) {
  if (!config) return

  const root = document.documentElement
  const baseRgb = hexToRgb(config.colors.primary) || hexToRgb('#e11d48')
  const shades = generateShades(baseRgb)

  for (const [shade, rgb] of Object.entries(shades)) {
    const override = config.shadeOverrides?.[shade]
    const finalRgb = (override && hexToRgb(override)) || rgb
    root.style.setProperty(`--brand-${shade}`, finalRgb.join(' '))
  }

  // Light primaries (e.g. gold) need dark button text; dark primaries need white.
  const onPrimary = luminance(baseRgb) > 0.3 ? [28, 26, 22] : WHITE
  root.style.setProperty('--brand-on-primary', onPrimary.join(' '))

  const accentRgb = hexToRgb(config.colors.accent) || baseRgb
  const sidebarRgb = hexToRgb(config.colors.sidebar) || BLACK
  root.style.setProperty('--brand-accent', accentRgb.join(' '))
  root.style.setProperty('--brand-accent-deep', mix(accentRgb, BLACK, 0.25).join(' '))
  root.style.setProperty('--brand-accent-soft', mix(accentRgb, WHITE, 0.92).join(' '))
  root.style.setProperty('--brand-sidebar', sidebarRgb.join(' '))

  const canvasRgb = config.colors.canvas ? hexToRgb(config.colors.canvas) : null
  if (canvasRgb) {
    root.style.setProperty('--brand-canvas', canvasRgb.join(' '))
  } else {
    root.style.removeProperty('--brand-canvas')
  }

  applyFonts(config.fonts)

  document.title = config.title

  if (config.favicon) {
    document
      .querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')
      .forEach((link) => {
        link.href = config.favicon
      })
  }
}
