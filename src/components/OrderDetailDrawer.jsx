import React, { useEffect, useRef } from 'react'
import { Package, Printer, Store, Truck, User, X } from 'lucide-react'
import { formatCurrency, formatDateTime, getStatusLabel } from '../utils/constants'
import { getOrderProducts, getProductLineTotal, getNetworkServiceCharge, getOrderCompanyName, hasTrackingInfo, isShippingOrder } from '../utils/orderDetail'
import OrderReceipt from './OrderReceipt'

function DetailSection({ title, children }) {
  return (
    <section className="detail-section">
      <h3 className="detail-section-title">{title}</h3>
      {children}
    </section>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  )
}

const OrderDetailDrawer = ({ order, customer, customerLabel, onClose }) => {
  const receiptRef = useRef(null)

  useEffect(() => {
    if (!order) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [order, onClose])

  if (!order) return null

  const handlePrintReceipt = () => {
    window.print()
  }

  const recipient = order.recipientorders?.[0] || {}
  const store = order.estDetails || {}
  const products = getOrderProducts(order)
  const shippingOrder = isShippingOrder(order)
  const showTracking = hasTrackingInfo(order)
  const recipientName = [recipient.firstName, recipient.lastName].filter(Boolean).join(' ')
  const statusLabel = getStatusLabel(order.corpOrderStatus, customer)

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="detail-main">
          <div className="detail-main-header">
            <div>
              <p className="detail-eyebrow">Order Detail</p>
              <h2 className="detail-title">{order.corpOrderNum}</h2>
              <p className="detail-subtitle">
                {statusLabel} · {formatCurrency(order.orderTotal)} · {formatDateTime(order.createdAt)}
              </p>
            </div>
            <button type="button" onClick={onClose} className="detail-close" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="detail-main-body">
            <DetailSection title="Order Information">
              <dl className="detail-grid">
                <DetailRow label="Bevvi Order Number" value={order.corpOrderNum} />
                <DetailRow label="External Order Number" value={recipient.externalOrderNumber} />
                <DetailRow label="Recipient Order Number" value={recipient.recipientOrderNum} />
                <DetailRow label="Status" value={statusLabel} />
                <DetailRow label="Order Type" value={order.orderType} />
                <DetailRow label="Company" value={getOrderCompanyName(order)} />
                <DetailRow label="Client" value={order.corpClient || customerLabel} />
              </dl>
            </DetailSection>

            <DetailSection title="Dates & Delivery">
              <dl className="detail-grid">
                <DetailRow label="Order Date" value={formatDateTime(order.createdAt)} />
                {shippingOrder && (
                  <>
                    <DetailRow
                      label="Delivery Date"
                      value={formatDateTime(order.deliveryDate || order.deliveryDateTimeToDisplay)}
                    />
                    <DetailRow label="Delivery Window" value={order.deliveryDateTimeToDisplay} />
                    <DetailRow label="Delivery Instructions" value={recipient.deliveryInstructions} />
                  </>
                )}
                {!shippingOrder && order.pickupDateTime && (
                  <DetailRow label="Pickup Date" value={formatDateTime(order.pickupDateTime)} />
                )}
              </dl>
            </DetailSection>

            <DetailSection title="Recipient">
              <div className="detail-card">
                <div className="detail-card-icon">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="detail-card-title">{recipientName || '—'}</p>
                  <p className="detail-card-text">{getOrderCompanyName(order)}</p>
                  <p className="detail-card-text">{recipient.email}</p>
                  <p className="detail-card-text">{recipient.phoneNum}</p>
                  <p className="detail-card-text mt-2">
                    {[recipient.streetAddress, recipient.aptSuiteNum].filter(Boolean).join(', ')}
                    <br />
                    {[recipient.city, recipient.state, recipient.zipcode].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Store">
              <div className="detail-card">
                <div className="detail-card-icon">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="detail-card-title">{store.name || '—'}</p>
                  <p className="detail-card-text">{store.address}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Products">
              {products.length === 0 ? (
                <p className="text-sm text-slate-500">No products listed.</p>
              ) : (
                <div className="detail-products">
                  {products.map((product, index) => (
                    <div key={`${product.name}-${index}`} className="detail-product-row">
                      <Package className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">
                          Qty {product.quantity || 1}
                          {product.size ? ` · ${product.size} ${product.units || ''}` : ''}
                          {product.upc ? ` · UPC ${product.upc}` : ''}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900 whitespace-nowrap">
                        {formatCurrency(getProductLineTotal(product))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </DetailSection>

            <DetailSection title="Charges">
              <dl className="detail-grid">
                <DetailRow label="Subtotal" value={formatCurrency(order.subTotal)} />
                <DetailRow label="Taxes" value={formatCurrency(order.taxes)} />
                <DetailRow label="Delivery Charge" value={formatCurrency(order.deliveryCharge)} />
                <DetailRow label="Service Charge" value={formatCurrency(order.serviceCharge)} />
                <DetailRow label="Service Charge Tax" value={formatCurrency(order.serviceChargeTax)} />
                {getNetworkServiceCharge(order) > 0 && (
                  <DetailRow label="Network Service Charge" value={formatCurrency(order.additionalFee)} />
                )}
                <DetailRow label="Tip" value={formatCurrency(order.tipAmt || order.tipAmount)} />
                <DetailRow label="Store Total" value={formatCurrency(order.storeTotal)} />
                <DetailRow label="Bevvi Total" value={formatCurrency(order.bevviTotal)} />
                <DetailRow label="Order Total" value={formatCurrency(order.orderTotal)} />
              </dl>
            </DetailSection>

            {showTracking && (
              <DetailSection title="Tracking">
                <dl className="detail-grid">
                  <DetailRow label="Tracking Number" value={recipient.trackingNo} />
                </dl>
              </DetailSection>
            )}
          </div>
        </div>

        <aside className="detail-receipt-pane">
          <div className="detail-receipt-header">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-bevvi-accent" />
              <span>Receipt</span>
            </div>
            <div className="detail-receipt-actions">
              <button type="button" onClick={handlePrintReceipt} className="detail-receipt-print">
                <Printer className="h-3.5 w-3.5 inline mr-1" />
                Save PDF
              </button>
            </div>
          </div>
          <div className="detail-receipt-scroll receipt-print-target" ref={receiptRef}>
            <OrderReceipt order={order} customer={customer} customerLabel={customerLabel} />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default OrderDetailDrawer
