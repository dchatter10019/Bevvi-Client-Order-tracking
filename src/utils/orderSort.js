import { getStatusLabel } from './constants'
import { getOrderCompanyName } from './orderDetail'

export const DEFAULT_ORDER_SORT = { column: 'orderDate', direction: 'desc' }

function dateSortValue(value) {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

export function getOrderSortValue(order, columnId, customer) {
  const recipient = order.recipientorders?.[0] || {}

  switch (columnId) {
    case 'bevviOrder':
      return order.corpOrderNum ?? ''
    case 'externalOrder':
      return recipient.externalOrderNumber ?? ''
    case 'status':
      return getStatusLabel(order.corpOrderStatus, customer)
    case 'orderDate':
      return dateSortValue(order.createdAt)
    case 'deliveryDate':
      return dateSortValue(order.deliveryDate || order.deliveryDateTimeToDisplay)
    case 'recipient':
      return [recipient.firstName, recipient.lastName].filter(Boolean).join(' ')
    case 'company':
      return getOrderCompanyName(order)
    case 'location':
      return [recipient.city, recipient.state].filter(Boolean).join(', ')
    case 'total':
      return Number(order.orderTotal) || 0
    default:
      return ''
  }
}

function compareSortValues(a, b, direction) {
  const factor = direction === 'asc' ? 1 : -1

  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  if (typeof a === 'number' && typeof b === 'number') {
    return factor * (a - b)
  }

  return factor * String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

export function sortOrders(orders, columnId, direction, customer) {
  return [...orders].sort((a, b) => {
    const aValue = getOrderSortValue(a, columnId, customer)
    const bValue = getOrderSortValue(b, columnId, customer)
    const result = compareSortValues(aValue, bValue, direction)
    if (result !== 0) return result

    const aFallback = dateSortValue(a.createdAt) ?? 0
    const bFallback = dateSortValue(b.createdAt) ?? 0
    return bFallback - aFallback
  })
}
