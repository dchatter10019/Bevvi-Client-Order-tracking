import { getCustomerConfig } from '../customers/customerRegistry'
import pkg from '../../package.json' with { type: 'json' }

export const APP_VERSION = pkg.version

export const AUTH = {
  username: 'bevviorders',
  password: 'bevviorders123#'
}

export const ORDER_STATUS_LABELS = {
  0: 'Pending',
  1: 'Accepted',
  2: 'Delivered',
  3: 'Shipped',
  4: 'Canceled',
  5: 'Rejected',
  6: 'Canceled'
}

export function getStatusLabel(status, client) {
  const config = client ? getCustomerConfig(client) : null
  if (config && status in config.statuses) {
    return config.statuses[status]
  }
  return ORDER_STATUS_LABELS[status] ?? `Status ${status}`
}

export function getCustomerLabel(clientId) {
  if (!clientId) return '—'
  const config = getCustomerConfig(clientId)
  return config?.label || clientId
}

export function getPipelineItems(client) {
  const config = client ? getCustomerConfig(client) : null
  if (config?.pipeline?.length) return config.pipeline
  return ['Pending', 'Accepted', 'Shipped', 'Delivered']
}

export function formatCurrency(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
