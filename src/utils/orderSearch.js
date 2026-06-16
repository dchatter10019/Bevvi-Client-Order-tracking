import { getCustomerConfig } from '../customers/customerRegistry'
import { getOrderCompanyName } from './orderDetail'

const AMOUNT_FIELDS = [
  'orderTotal',
  'subTotal',
  'taxes',
  'deliveryCharge',
  'serviceCharge',
  'serviceChargeTax',
  'tipAmt',
  'tipAmount',
  'storeTotal',
  'bevviTotal',
  'shippingCharges',
  'promodiscAmt',
  'giftTotal',
  'totalCCFee'
]

function matchesCustomer(order, termLower) {
  const clientId = order.corpClient
  if (clientId?.toLowerCase().includes(termLower)) return true
  const label = getCustomerConfig(clientId)?.label
  if (label?.toLowerCase().includes(termLower)) return true
  return false
}

function parseAmountQuery(term) {
  const cleaned = term.trim().replace(/[$,\s]/g, '')
  if (!cleaned || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null
  const num = Number(cleaned)
  return Number.isNaN(num) ? null : num
}

function isAmountSearch(term) {
  const cleaned = term.trim().replace(/[$,\s]/g, '')
  return /^-?\d+(\.\d+)?$/.test(cleaned)
}

function matchesExactAmount(order, queryNum) {
  const queryCents = Math.round(queryNum * 100)

  return AMOUNT_FIELDS.some((field) => {
    const value = order[field]
    if (value == null || value === '') return false
    const num = Number(value)
    if (Number.isNaN(num)) return false
    return Math.round(num * 100) === queryCents
  })
}

function matchesLocation(recipient, termLower) {
  const city = recipient.city?.trim()
  const state = recipient.state?.trim()
  const zipcode = recipient.zipcode?.trim()

  const locationValues = [
    city,
    state,
    zipcode,
    city && state ? `${city}, ${state}` : null,
    [city, state, zipcode].filter(Boolean).join(', ') || null
  ]

  return locationValues.some((value) => value?.toLowerCase().includes(termLower))
}

export function orderMatchesSearch(order, rawSearch) {
  const term = rawSearch.trim()
  if (!term) return true

  const recipient = order.recipientorders?.[0] || {}
  const termLower = term.toLowerCase()

  if (order.corpOrderNum?.toLowerCase().includes(termLower)) return true
  if (recipient.externalOrderNumber?.toLowerCase().includes(termLower)) return true
  if (getOrderCompanyName(order).toLowerCase().includes(termLower)) return true
  if (matchesCustomer(order, termLower)) return true

  const amountQuery = parseAmountQuery(term)
  if (isAmountSearch(term) && amountQuery != null && matchesExactAmount(order, amountQuery)) {
    return true
  }

  if (matchesLocation(recipient, termLower)) return true

  return false
}

export const SEARCH_PLACEHOLDER =
  'Search by order number, company, amount, or location…'

export const SEARCH_TOOLTIP =
  'Search by Bevvi order number, external order number, company name, exact amount (e.g. 1,389.00), or location (city, state, or zip).'
