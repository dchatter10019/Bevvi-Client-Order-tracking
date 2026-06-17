/** Default pattern: https://<customer-id>.ordertracker.getbevvi.com */
const DEFAULT_HOST_SUFFIX = 'ordertracker.getbevvi.com'

/** Internal hub — all customers, switchable in-app. */
export const HUB_HOSTNAME = DEFAULT_HOST_SUFFIX

export function getCustomerHostSuffix() {
  const configured = import.meta.env.VITE_CUSTOMER_HOST_SUFFIX
  return (configured || DEFAULT_HOST_SUFFIX).toLowerCase().replace(/^\.+|\.+$/g, '')
}

export function isHubHostname(hostname) {
  if (!hostname) return false
  const host = hostname.toLowerCase().split(':')[0]
  return host === HUB_HOSTNAME || host === `www.${HUB_HOSTNAME}`
}

/** Build hostname → customer id map from customer configs. */
export function buildHostnameMap(customers) {
  const map = {}

  for (const config of Object.values(customers)) {
    for (const host of config.hostnames || []) {
      map[host] = config.id
    }
    // Default: <id>.ordertracker.getbevvi.com
    map[`${config.id}.${getCustomerHostSuffix()}`] = config.id
  }

  return map
}

/**
 * Resolve customer id from the current hostname.
 * Checks explicit hostnames first, then the default subdomain pattern.
 */
export function resolveCustomerFromHostname(hostname, hostnameMap = {}) {
  if (!hostname) return null

  const host = hostname.toLowerCase().split(':')[0]
  if (host === 'www') return null

  if (hostnameMap[host]) return hostnameMap[host]

  const suffix = getCustomerHostSuffix()
  if (host === suffix) return null

  const prefix = `.${suffix}`
  if (!host.endsWith(prefix)) return null

  const subdomain = host.slice(0, -prefix.length)
  if (!subdomain || subdomain.includes('.')) return null

  return subdomain
}

/** True when hostname is configured for a customer but id is missing from registry. */
export function resolveUnknownHostCustomerId(hostname, hostnameMap, customers) {
  if (!hostname) return null
  const host = hostname.toLowerCase().split(':')[0]
  const mappedId = hostnameMap[host]
  if (mappedId && !customers[mappedId]) return mappedId

  const fromPattern = resolveCustomerFromHostname(host, hostnameMap)
  if (fromPattern && !customers[fromPattern]) return fromPattern

  return null
}
