import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  Download,
  LogOut,
  RefreshCw,
  Search,
  SlidersHorizontal
} from 'lucide-react'
import { fetchOrders } from '../utils/api'
import { downloadOrdersCsv } from '../utils/csvExport'
import { CUSTOMERS, formatCurrency, getPipelineItems, getStatusLabel } from '../utils/constants'
import { defaultDateRange, daysBetweenInclusive, daysFromTodayTo, filterOrdersByDateRange, isValidDateRange } from '../utils/dateUtils'
import { orderMatchesSearch, SEARCH_PLACEHOLDER } from '../utils/orderSearch'
import OrderTable from './OrderTable'
import OrderDetailDrawer from './OrderDetailDrawer'
import Logo from './Logo'

const Dashboard = ({ onLogout }) => {
  const initialRange = defaultDateRange()
  const [customer, setCustomer] = useState(CUSTOMERS[0].value)
  const [startDate, setStartDate] = useState(initialRange.startDate)
  const [endDate, setEndDate] = useState(initialRange.endDate)
  const [rawOrders, setRawOrders] = useState([])
  const [fetchScope, setFetchScope] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastFetched, setLastFetched] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const fetchRequestRef = useRef(0)
  const abortControllerRef = useRef(null)

  const customerLabel = CUSTOMERS.find((c) => c.value === customer)?.label || customer
  const dayCount = daysBetweenInclusive(startDate, endDate)
  const neededDays = daysFromTodayTo(startDate)
  const rangeIsValid = isValidDateRange(startDate, endDate)
  const currentFetchScope = `${customer}:${neededDays}`

  const orders = useMemo(() => {
    if (!rangeIsValid) return []
    return filterOrdersByDateRange(rawOrders, startDate, endDate)
  }, [rawOrders, startDate, endDate, rangeIsValid])

  const loadOrders = useCallback(async ({ force = false } = {}) => {
    if (!rangeIsValid) {
      setError('Start date must be on or before end date.')
      return
    }

    if (!force && fetchScope === currentFetchScope && rawOrders.length > 0) {
      setError('')
      return
    }

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    const requestId = ++fetchRequestRef.current

    setIsLoading(true)
    setError('')

    try {
      const result = await fetchOrders({
        client: customer,
        startDate,
        signal: controller.signal
      })

      if (requestId !== fetchRequestRef.current) return

      setRawOrders(result.orders)
      setFetchScope(currentFetchScope)
      setLastFetched(new Date())
    } catch (err) {
      if (err.name === 'AbortError') return
      if (requestId !== fetchRequestRef.current) return
      setRawOrders([])
      setFetchScope('')
      setError(err.message || 'Failed to load orders')
    } finally {
      if (requestId === fetchRequestRef.current) {
        setIsLoading(false)
      }
    }
  }, [customer, startDate, neededDays, currentFetchScope, fetchScope, rawOrders.length, rangeIsValid])

  useEffect(() => {
    setRawOrders([])
    setFetchScope('')
    setStatusFilter('all')
    setSelectedOrder(null)
  }, [customer])

  useEffect(() => {
    loadOrders()
  }, [customer, neededDays, loadOrders])

  useEffect(() => {
    return () => abortControllerRef.current?.abort()
  }, [])

  const pipeline = useMemo(() => {
    const counts = {}
    orders.forEach((o) => {
      const label = getStatusLabel(o.corpOrderStatus, customer)
      counts[label] = (counts[label] || 0) + 1
    })
    return counts
  }, [orders, customer])

  const filteredOrders = useMemo(() => {
    let list = orders

    if (statusFilter !== 'all') {
      list = list.filter((o) => getStatusLabel(o.corpOrderStatus, customer) === statusFilter)
    }

    if (search.trim()) {
      list = list.filter((order) => orderMatchesSearch(order, search))
    }

    return list
  }, [orders, search, statusFilter, customer])

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [filteredOrders])

  const totalValue = filteredOrders.reduce((sum, o) => sum + (Number(o.orderTotal) || 0), 0)

  const handleDownload = () => {
    const slug = customerLabel.toLowerCase().replace(/\s+/g, '-')
    downloadOrdersCsv(filteredOrders, `bevvi-monitor-${slug}-${startDate}-to-${endDate}.csv`, customer)
  }

  const pipelineItems = getPipelineItems(customer)

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="monitor-sidebar w-72 shrink-0 min-h-screen flex flex-col">
        <div className="monitor-brand">
          <Logo size="default" />
          <h1 className="mt-3 text-xl font-bold text-white">Order Monitor</h1>
          <p className="text-xs text-slate-400 mt-1">Partner channel console</p>
        </div>

        <div className="flex flex-1 flex-col p-6">
        <div className="space-y-5 flex-1">
          <div>
            <label className="monitor-label">Customer</label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="monitor-input"
            >
              {CUSTOMERS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="monitor-label">Date range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="monitor-input"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="monitor-input"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {dayCount} day window
              {rangeIsValid ? ` · ${startDate} to ${endDate}` : ' · invalid range'}
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button onClick={() => loadOrders({ force: true })} disabled={isLoading || !rangeIsValid} className="monitor-btn w-full">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing…' : 'Refresh Feed'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!filteredOrders.length}
              className="monitor-btn-ghost w-full"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-auto pt-8 flex items-center gap-2 text-sm text-slate-500 hover:text-white transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-bevvi-600" />
                <h2 className="text-lg font-bold text-slate-900">{customerLabel}</h2>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {filteredOrders.length} orders · {formatCurrency(totalValue)} total value
                {lastFetched && ` · Updated ${lastFetched.toLocaleTimeString()}`}
                {isLoading && ' · Updating…'}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder={SEARCH_PLACEHOLDER}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm focus:border-bevvi-500 focus:outline-none focus:ring-2 focus:ring-bevvi-500/20"
              />
            </div>
          </div>
        </header>

        <div className="px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status pipeline</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({orders.length})
            </button>
            {pipelineItems.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  statusFilter === status
                    ? 'bg-bevvi-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status} ({pipeline[status] || 0})
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <RefreshCw className="h-8 w-8 animate-spin text-bevvi-600 mb-3" />
              <p className="text-sm">Pulling latest orders…</p>
            </div>
          )}

          {!isLoading && filteredOrders.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Activity className="h-10 w-10 text-slate-300 mb-3" />
              <p className="font-medium text-slate-700">No orders in this window</p>
              <p className="text-sm mt-1">Adjust the date range or customer and refresh.</p>
            </div>
          )}

          {sortedOrders.length > 0 && (
            <div className={isLoading ? 'opacity-60 pointer-events-none' : ''}>
              <OrderTable
                orders={sortedOrders}
                customer={customer}
                selectedOrderId={selectedOrder?.id || selectedOrder?.corpOrderNum}
                onOrderSelect={setSelectedOrder}
              />
            </div>
          )}
        </main>
      </div>

      <OrderDetailDrawer
        order={selectedOrder}
        customer={customer}
        customerLabel={customerLabel}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  )
}

export default Dashboard
