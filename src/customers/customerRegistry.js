import { parseCustomerConfig, normalizeCustomerConfig } from './parseCustomerConfig'
import { resolveCustomerFromHostname } from './resolveCustomerHost'

const configFiles = import.meta.glob('../../customers/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

const customers = {}

for (const [path, raw] of Object.entries(configFiles)) {
  const fileName = path.split('/').pop()
  if (fileName.toLowerCase() === 'readme.md') continue

  const normalized = normalizeCustomerConfig(parseCustomerConfig(raw), fileName)
  if (normalized) {
    customers[normalized.id] = normalized
  }
}

if (Object.keys(customers).length === 0) {
  console.error('No customer configs found in customers/*.md')
}

function resolveHostCustomerId() {
  if (typeof window === 'undefined') return null
  return resolveCustomerFromHostname(window.location.hostname)
}

function resolveLockedCustomerId() {
  const fromHost = resolveHostCustomerId()
  if (fromHost && customers[fromHost]) return fromHost

  const fromEnv = import.meta.env.VITE_CUSTOMER
  if (fromEnv && customers[fromEnv]) return fromEnv

  return null
}

/** Set when URL matches *.ordertracker.getbevvi.com but id has no config. */
export const UNKNOWN_HOST_CUSTOMER_ID = (() => {
  const fromHost = resolveHostCustomerId()
  if (fromHost && !customers[fromHost]) return fromHost
  return null
})()

/** Locked when hostname or VITE_CUSTOMER resolves to a known customer. */
const lockedId = resolveLockedCustomerId()

export const CUSTOMER_LOCKED = Boolean(lockedId)

export const CUSTOMER_LIST = CUSTOMER_LOCKED
  ? [customers[lockedId]]
  : Object.values(customers).sort((a, b) => a.label.localeCompare(b.label))

export const DEFAULT_CUSTOMER_ID = lockedId || CUSTOMER_LIST[0]?.id || ''

export function getCustomerConfig(id) {
  return customers[id] || null
}
