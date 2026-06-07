import { buildOrderQuery } from './dateUtils'

export async function fetchOrders({ client, startDate, signal }) {
  const query = buildOrderQuery({ client, startDate })
  const params = new URLSearchParams(query)
  const response = await fetch(`/api/orders?${params.toString()}`, { signal })

  const payload = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Unable to load orders')
  }

  return {
    orders: Array.isArray(payload.data) ? payload.data : [],
    apiUrl: payload.apiUrl,
    numofdays: Number(query.numofdays)
  }
}
