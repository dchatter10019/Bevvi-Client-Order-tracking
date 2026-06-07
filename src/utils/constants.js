export const CUSTOMERS = [
  { label: 'Air Culinaire', value: 'airculinaire' }
]

export const APP_VERSION = '1.0.0'

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

const CUSTOMER_STATUS_LABELS = {
  airculinaire: {
    0: 'Pending',
    1: 'Accepted',
    2: 'Delivered',
    3: 'In Transit',
    4: 'Canceled',
    5: 'Rejected',
    6: 'In Transit'
  }
}

const CUSTOMER_PIPELINE = {
  airculinaire: ['Pending', 'Accepted', 'In Transit', 'Delivered', 'Rejected', 'Canceled']
}

export function getStatusLabel(status, client) {
  const clientLabels = client && CUSTOMER_STATUS_LABELS[client]
  if (clientLabels && status in clientLabels) {
    return clientLabels[status]
  }
  return ORDER_STATUS_LABELS[status] ?? `Status ${status}`
}

export function getPipelineItems(client) {
  return CUSTOMER_PIPELINE[client] ?? ['Pending', 'Accepted', 'Shipped', 'Delivered']
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
