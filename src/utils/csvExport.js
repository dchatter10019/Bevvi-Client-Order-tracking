import { formatCurrency, formatDate, formatDateTime, getStatusLabel } from './constants'

function escapeCsv(value) {
  const str = value == null ? '' : String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function flattenOrder(order, client) {
  const recipient = order.recipientorders?.[0] || {}

  return {
    orderNumber: order.corpOrderNum || order.origOrderNumber || '',
    externalOrderNumber: recipient.externalOrderNumber || '',
    companyName: order.account?.companyName || recipient.companyName || '',
    status: getStatusLabel(order.corpOrderStatus, client || order.corpClient),
    orderDate: formatDateTime(order.createdAt),
    deliveryDate: formatDateTime(order.deliveryDate || order.deliveryDateTimeToDisplay),
    recipientFirstName: recipient.firstName || '',
    recipientLastName: recipient.lastName || '',
    recipientEmail: recipient.email || '',
    recipientPhone: recipient.phoneNum || '',
    recipientCity: recipient.city || '',
    recipientState: recipient.state || '',
    recipientZip: recipient.zipcode || '',
    subtotal: formatCurrency(order.subTotal),
    taxes: formatCurrency(order.taxes),
    deliveryCharge: formatCurrency(order.deliveryCharge),
    serviceCharge: formatCurrency(order.serviceCharge),
    tip: formatCurrency(order.tipAmt || order.tipAmount),
    orderTotal: formatCurrency(order.orderTotal),
    orderType: order.orderType || '',
    client: order.corpClient || ''
  }
}

const CSV_COLUMNS = [
  ['orderNumber', 'Bevvi Order Number'],
  ['externalOrderNumber', 'External Order Number'],
  ['companyName', 'Company / Vendor'],
  ['status', 'Status'],
  ['orderDate', 'Order Date'],
  ['deliveryDate', 'Delivery Date'],
  ['recipientFirstName', 'Recipient First Name'],
  ['recipientLastName', 'Recipient Last Name'],
  ['recipientEmail', 'Recipient Email'],
  ['recipientPhone', 'Recipient Phone'],
  ['recipientCity', 'City'],
  ['recipientState', 'State'],
  ['recipientZip', 'Zip'],
  ['subtotal', 'Subtotal'],
  ['taxes', 'Taxes'],
  ['deliveryCharge', 'Delivery Charge'],
  ['serviceCharge', 'Service Charge'],
  ['tip', 'Tip'],
  ['orderTotal', 'Order Total'],
  ['orderType', 'Order Type'],
  ['client', 'Client']
]

export function downloadOrdersCsv(orders, filename = 'bevvi-orders.csv', client) {
  const rows = orders.map((order) => flattenOrder(order, client))
  const header = CSV_COLUMNS.map(([, label]) => escapeCsv(label)).join(',')
  const body = rows
    .map((row) =>
      CSV_COLUMNS.map(([key]) => escapeCsv(row[key])).join(',')
    )
    .join('\n')

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export { flattenOrder }
