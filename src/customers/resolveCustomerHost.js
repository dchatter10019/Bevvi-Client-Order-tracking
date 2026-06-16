/** Production white-label host pattern: https://<customer>.ordertracker.getbevvi.com */
const DEFAULT_HOST_SUFFIX = 'ordertracker.getbevvi.com'

export function getCustomerHostSuffix() {
  const configured = import.meta.env.VITE_CUSTOMER_HOST_SUFFIX
  return (configured || DEFAULT_HOST_SUFFIX).toLowerCase().replace(/^\.+|\.+$/g, '')
}

/**
 * Extract customer id from a white-label subdomain.
 * Returns null for bare domain, unknown hosts, or www.
 */
export function resolveCustomerFromHostname(
  hostname,
  suffix = getCustomerHostSuffix()
) {
  if (!hostname || !suffix) return null

  const host = hostname.toLowerCase().split(':')[0]
  const normalizedSuffix = suffix.toLowerCase()

  if (host === normalizedSuffix) return null

  const prefix = `.${normalizedSuffix}`
  if (!host.endsWith(prefix)) return null

  const subdomain = host.slice(0, -prefix.length)
  if (!subdomain || subdomain.includes('.') || subdomain === 'www') return null

  return subdomain
}
