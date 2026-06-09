import React, { useCallback, useEffect, useRef, useState } from 'react'
import { formatCurrency, formatDateTime, getStatusLabel } from '../utils/constants'

const STORAGE_KEY = 'bevvi-order-monitor-column-widths'

const COLUMNS = [
  { id: 'bevviOrder', label: 'Bevvi Order Number', defaultWidth: 240, minWidth: 140, mono: true, nowrap: true },
  { id: 'externalOrder', label: 'External Order #', defaultWidth: 160, minWidth: 110, mono: true, nowrap: true },
  { id: 'status', label: 'Status', defaultWidth: 110, minWidth: 90 },
  { id: 'orderDate', label: 'Order Date', defaultWidth: 180, minWidth: 130, nowrap: true },
  { id: 'deliveryDate', label: 'Delivery Date', defaultWidth: 180, minWidth: 130, nowrap: true },
  { id: 'recipient', label: 'Recipient', defaultWidth: 160, minWidth: 100 },
  { id: 'location', label: 'Location', defaultWidth: 140, minWidth: 100 },
  { id: 'store', label: 'Store', defaultWidth: 180, minWidth: 120 },
  { id: 'total', label: 'Total', defaultWidth: 110, minWidth: 90, align: 'right', nowrap: true }
]

function defaultWidths() {
  return Object.fromEntries(COLUMNS.map((col) => [col.id, col.defaultWidth]))
}

function loadWidths() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultWidths()
    const parsed = JSON.parse(saved)
    const widths = defaultWidths()
    COLUMNS.forEach((col) => {
      if (typeof parsed[col.id] === 'number') {
        widths[col.id] = Math.max(col.minWidth, parsed[col.id])
      }
    })
    return widths
  } catch {
    return defaultWidths()
  }
}

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800',
  Accepted: 'bg-sky-100 text-sky-800',
  'In Transit': 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Canceled: 'bg-slate-100 text-slate-600',
  Rejected: 'bg-red-100 text-red-800'
}

function StatusBadge({ status, client }) {
  const label = getStatusLabel(status, client)
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${statusStyles[label] || 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  )
}

function OrderCardList({ orders, customer, selectedOrderId, onOrderSelect }) {
  return (
    <div className="order-card-list lg:hidden">
      {orders.map((order) => {
        const recipient = order.recipientorders?.[0] || {}
        const store = order.estDetails || {}
        const recipientName = [recipient.firstName, recipient.lastName].filter(Boolean).join(' ')
        const location = [recipient.city, recipient.state].filter(Boolean).join(', ')
        const orderId = order.id || order.corpOrderNum
        const isSelected = selectedOrderId === orderId

        return (
          <button
            key={orderId}
            type="button"
            onClick={() => onOrderSelect?.(order)}
            className={`order-card ${isSelected ? 'is-selected' : ''}`}
          >
            <div className="order-card-top">
              <span className="order-card-number">{order.corpOrderNum}</span>
              <StatusBadge status={order.corpOrderStatus} client={customer} />
            </div>

            <div className="order-card-meta">
              <span>{formatDateTime(order.createdAt)}</span>
              <span className="order-card-total">{formatCurrency(order.orderTotal)}</span>
            </div>

            {(recipient.externalOrderNumber || location || recipientName || store.name) && (
              <div className="order-card-details">
                {recipient.externalOrderNumber && (
                  <span>Ref {recipient.externalOrderNumber}</span>
                )}
                {location && <span>{location}</span>}
                {recipientName && <span>{recipientName}</span>}
                {store.name && <span>{store.name}</span>}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

function ResizableHeader({ column, width, onResizeStart, isResizing }) {
  return (
    <th
      className={`list-head resizable-head ${isResizing ? 'is-resizing' : ''}`}
      style={{ width, minWidth: width, maxWidth: width }}
    >
      <span className={`block truncate ${column.align === 'right' ? 'text-right' : ''}`}>
        {column.label}
      </span>
      <span
        role="separator"
        aria-orientation="vertical"
        aria-label={`Resize ${column.label} column`}
        className="col-resize-handle"
        onMouseDown={(e) => onResizeStart(column.id, e)}
      />
    </th>
  )
}

function OrderTable({ orders, customer, selectedOrderId, onOrderSelect }) {
  const [columnWidths, setColumnWidths] = useState(loadWidths)
  const [resizingColumn, setResizingColumn] = useState(null)
  const resizeState = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnWidths))
  }, [columnWidths])

  const handleResizeStart = useCallback((columnId, event) => {
    event.preventDefault()
    event.stopPropagation()

    resizeState.current = {
      columnId,
      startX: event.clientX,
      startWidth: columnWidths[columnId]
    }
    setResizingColumn(columnId)

    const handleMouseMove = (e) => {
      const state = resizeState.current
      if (!state) return

      const column = COLUMNS.find((col) => col.id === state.columnId)
      const minWidth = column?.minWidth ?? 80
      const nextWidth = Math.max(minWidth, state.startWidth + (e.clientX - state.startX))

      setColumnWidths((prev) => ({
        ...prev,
        [state.columnId]: nextWidth
      }))
    }

    const handleMouseUp = () => {
      resizeState.current = null
      setResizingColumn(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [columnWidths])

  const tableWidth = COLUMNS.reduce((sum, col) => sum + columnWidths[col.id], 0)

  const cellClass = (column) => {
    const parts = ['list-cell']
    if (column.mono) parts.push('font-mono')
    if (column.nowrap) parts.push('whitespace-nowrap')
    else parts.push('truncate')
    if (column.align === 'right') parts.push('text-right')
    return parts.join(' ')
  }

  return (
    <>
      <OrderCardList
        orders={orders}
        customer={customer}
        selectedOrderId={selectedOrderId}
        onOrderSelect={onOrderSelect}
      />

      <div className={`hidden lg:block overflow-x-auto ${resizingColumn ? 'is-column-resizing' : ''}`}>
      <table className="resizable-table" style={{ width: tableWidth, minWidth: '100%' }}>
        <colgroup>
          {COLUMNS.map((column) => (
            <col key={column.id} style={{ width: columnWidths[column.id] }} />
          ))}
        </colgroup>
        <thead className="bg-slate-50 border-y border-slate-200 sticky top-0 z-10">
          <tr>
            {COLUMNS.map((column) => (
              <ResizableHeader
                key={column.id}
                column={column}
                width={columnWidths[column.id]}
                onResizeStart={handleResizeStart}
                isResizing={resizingColumn === column.id}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {orders.map((order) => {
            const recipient = order.recipientorders?.[0] || {}
            const store = order.estDetails || {}
            const recipientName = [recipient.firstName, recipient.lastName].filter(Boolean).join(' ')
            const location = [recipient.city, recipient.state].filter(Boolean).join(', ')

            const values = {
              bevviOrder: order.corpOrderNum,
              externalOrder: recipient.externalOrderNumber || '—',
              status: <StatusBadge status={order.corpOrderStatus} client={customer} />,
              orderDate: formatDateTime(order.createdAt),
              deliveryDate: formatDateTime(order.deliveryDate || order.deliveryDateTimeToDisplay),
              recipient: recipientName || '—',
              location: location || '—',
              store: store.name || '—',
              total: formatCurrency(order.orderTotal)
            }

            return (
              <tr
                key={order.id || order.corpOrderNum}
                onClick={() => onOrderSelect?.(order)}
                className={`cursor-pointer transition-colors ${
                  selectedOrderId === (order.id || order.corpOrderNum)
                    ? 'bg-bevvi-50'
                    : 'hover:bg-slate-50'
                }`}
              >
                {COLUMNS.map((column) => (
                  <td
                    key={column.id}
                    className={`${cellClass(column)} ${
                      column.id === 'bevviOrder'
                        ? 'text-sm font-medium text-bevvi-700'
                        : column.id === 'total'
                          ? 'font-semibold text-slate-900'
                          : column.id === 'externalOrder'
                            ? 'text-sm text-slate-700'
                            : 'text-slate-600'
                    }`}
                    style={{ width: columnWidths[column.id], maxWidth: columnWidths[column.id] }}
                    title={typeof values[column.id] === 'string' ? values[column.id] : undefined}
                  >
                    {values[column.id]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </>
  )
}

export default OrderTable
