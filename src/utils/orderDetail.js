export function getOrderProducts(order) {
  if (order.products?.length) return order.products
  return order.recipientorders?.[0]?.products || []
}

export function formatReceiptDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatReceiptTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function formatMoney(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num)
}

export function getStoreChargeTotal(order) {
  return Number(order.storeTotal) || 0
}

export function getNetworkServiceCharge(order) {
  return Number(order.additionalFee) || 0
}

export function getBevviChargeTotal(order) {
  const taxes = Number(order.taxes) || 0
  const serviceCharge = Number(order.serviceCharge) || 0
  const serviceChargeTax = Number(order.serviceChargeTax) || 0
  const bevviCCFee = Number(order.bevviCCFee) || 0
  const networkServiceCharge = getNetworkServiceCharge(order)
  return taxes + serviceCharge + serviceChargeTax + bevviCCFee + networkServiceCharge
}

export function getTrackerSteps(status, client) {
  const numericStatus = Number(status)

  if (client === 'airculinaire') {
    const isAccepted = numericStatus === 1 || numericStatus === 2 || numericStatus === 3 || numericStatus === 6
    const isInTransit = numericStatus === 3 || numericStatus === 6 || numericStatus === 2

    return [
      { key: 'ordered', label: 'Ordered', done: true },
      { key: 'accepted', label: 'Accepted', done: isAccepted },
      { key: 'in_transit', label: 'In Transit', done: isInTransit },
      { key: 'delivered', label: 'Delivered', done: numericStatus === 2 }
    ]
  }

  const label =
    numericStatus === 2
      ? 'delivered'
      : numericStatus === 1 || numericStatus === 3
        ? 'confirmed'
        : 'ordered'

  return [
    { key: 'ordered', label: 'Ordered', done: true },
    { key: 'confirmed', label: 'Confirmed', done: label === 'confirmed' || label === 'delivered' },
    { key: 'delivered', label: 'Delivered', done: label === 'delivered' }
  ]
}

export function getProductLineTotal(product) {
  const price = Number(product.price) || 0
  const qty = Number(product.quantity) || 1
  return price * qty
}

export function getProductSubtitle(product) {
  const size = product.size ? `${product.size} ${product.units || ''}`.trim() : ''
  if (size) return size
  return product.slug ? product.slug.replace(/-/g, ' ') : 'Premium selection'
}

export function getProductTag(product) {
  const size = product.size ? `${product.size} ${product.units || ''}`.trim() : ''
  const qty = Number(product.quantity) || 1
  const bottleLabel = qty === 1 ? 'Single Bottle' : `${qty} Bottles`
  return size ? `${size} · ${bottleLabel}` : bottleLabel
}

export function isShippingOrder(order) {
  if (order.isDeliveryOrder === true) return true
  if (order.isThirdPartyDeliveryOrder === true) return true

  const type = (order.orderType || '').toLowerCase()
  return type === 'delivery' || type === 'shipping'
}

export function hasTrackingInfo(order) {
  if (!isShippingOrder(order)) return false

  const recipient = order.recipientorders?.[0] || {}
  const tracking = (recipient.trackingNo || '').trim()
  return Boolean(tracking && tracking.toLowerCase() !== 'not yet shipped')
}
