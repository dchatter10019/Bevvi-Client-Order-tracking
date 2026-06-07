function parseDateOnly(value) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function defaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 6)
  return {
    startDate: toInputDate(start),
    endDate: toInputDate(end)
  }
}

export function toInputDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getOrderDateKey(order) {
  if (!order?.createdAt) return ''
  const created = new Date(order.createdAt)
  if (Number.isNaN(created.getTime())) return ''
  return toInputDate(created)
}

export function daysBetweenInclusive(startDate, endDate) {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end) return 7
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff + 1)
}

export function daysFromTodayTo(dateValue) {
  const target = parseDateOnly(dateValue)
  if (!target) return 7
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((today - target) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff + 1)
}

export function isValidDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false
  return startDate <= endDate
}

export function filterOrdersByDateRange(orders, startDate, endDate) {
  if (!Array.isArray(orders) || !isValidDateRange(startDate, endDate)) {
    return orders
  }

  return orders.filter((order) => {
    const day = getOrderDateKey(order)
    return day >= startDate && day <= endDate
  })
}

export function buildOrderQuery({ client, startDate }) {
  return {
    client,
    numofdays: String(daysFromTodayTo(startDate))
  }
}
