import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  Download,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { fetchOrders } from '../utils/api'
import { downloadOrdersCsv } from '../utils/csvExport'
import { formatCurrency, getPipelineItems, getStatusLabel } from '../utils/constants'
import { useCustomer } from '../customers/CustomerContext'
import { defaultDateRange, daysBetweenInclusive, daysFromTodayTo, filterOrdersByDateRange, isValidDateRange } from '../utils/dateUtils'
import { orderMatchesSearch, SEARCH_PLACEHOLDER, SEARCH_TOOLTIP } from '../utils/orderSearch'
import OrderTable from './OrderTable'
import OrderDetailDrawer from './OrderDetailDrawer'
import Logo from './Logo'
import StatusFooter from './StatusFooter'

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate()
  const initialRange = defaultDateRange()
  const { customerId: customer, setCustomerId: setCustomer, config, customers, locked } = useCustomer()
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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const fetchRequestRef = useRef(0)
  const abortControllerRef = useRef(null)

  const customerLabel = config?.label || customer
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
    setFiltersOpen(false)
  }, [customer])

  useEffect(() => {
    if (!filtersOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [filtersOpen])

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

  const handleLogout = () => {
    abortControllerRef.current?.abort()
    setSelectedOrder(null)
    onLogout()
    navigate('/login')
  }

  const pipelineItems = getPipelineItems(customer)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bevvi-canvas">
      <div className="flex flex-1 min-h-0 relative">
      {filtersOpen && (
        <button
          type="button"
          className="monitor-sidebar-backdrop lg:hidden"
          onClick={() => setFiltersOpen(false)}
          aria-label="Close filters"
        />
      )}

      <aside
        className={`monitor-sidebar monitor-sidebar-panel w-72 shrink-0 h-full flex flex-col overflow-y-auto ${
          filtersOpen ? 'is-open' : ''
        }`}
      >
        <div className="monitor-brand">
          <div className="flex items-start justify-between gap-3">
            <Logo size="default" />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="monitor-sidebar-close lg:hidden"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h1 className="mt-3 text-xl font-bold text-white">Order Monitor</h1>
          <p className="text-xs text-slate-400 mt-1">Partner channel console</p>
        </div>

        <div className="flex flex-1 flex-col p-6">
        <div className="space-y-5 flex-1">
          <div>
            <label className="monitor-label">Customer</label>
            {locked ? (
              <p className="monitor-input cursor-default select-none">{customerLabel}</p>
            ) : (
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="monitor-input"
              >
                {customers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            )}
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
          type="button"
          onClick={handleLogout}
          className="monitor-btn-logout w-full mt-8"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="monitor-mobile-menu lg:hidden"
                aria-label="Open filters"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-bevvi-600 shrink-0" />
                  <h2 className="text-lg font-bold text-slate-900 truncate">{customerLabel}</h2>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  {filteredOrders.length} orders · {formatCurrency(totalValue)} total value
                  {lastFetched && (
                    <span className="hidden sm:inline">{` · Updated ${lastFetched.toLocaleTimeString()}`}</span>
                  )}
                  {isLoading && ' · Updating…'}
                </p>
              </div>
            </div>

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder={SEARCH_PLACEHOLDER}
                title={SEARCH_TOOLTIP}
                aria-label={SEARCH_TOOLTIP}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm focus:border-bevvi-500 focus:outline-none focus:ring-2 focus:ring-bevvi-500/20"
              />
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status pipeline</span>
          </div>
          <div className="monitor-pipeline-scroll">
            <button
              onClick={() => setStatusFilter('all')}
              className={`monitor-pipeline-pill shrink-0 ${
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
                className={`monitor-pipeline-pill shrink-0 ${
                  statusFilter === status
                    ? 'bg-bevvi-600 text-bevvi-onprimary'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status} ({pipeline[status] || 0})
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto">
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                onOrderSelect={(order) => {
                  setSelectedOrder(order)
                  setFiltersOpen(false)
                }}
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

      <StatusFooter isLoading={isLoading} error={error} />
    </div>
  )
}

export default Dashboard
