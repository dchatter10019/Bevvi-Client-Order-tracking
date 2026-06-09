import React from 'react'
import {
  formatMoney,
  formatReceiptDate,
  formatReceiptTime,
  getBevviChargeTotal,
  getOrderProducts,
  getProductLineTotal,
  getProductSubtitle,
  getProductTag,
  getStoreChargeTotal,
  getTrackerSteps,
  isShippingOrder
} from '../utils/orderDetail'
import Logo from './Logo'
import '../styles/receipt.css'

function BottleIcon({ productName = '' }) {
  const parts = (productName || '').split(' ')
  const brand = parts.slice(0, 2).join(' ').toUpperCase().slice(0, 12) || 'BEVVI'
  const varietal = parts.slice(2).join(' ') || 'Selection'

  return (
    <svg viewBox="0 0 60 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="receipt-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#3d0a18" />
          <stop offset=".4" stopColor="#5a1224" />
          <stop offset=".6" stopColor="#7a1a30" />
          <stop offset="1" stopColor="#2a0810" />
        </linearGradient>
      </defs>
      <rect x="25" y="4" width="10" height="22" fill="url(#receipt-glass)" />
      <rect x="24" y="2" width="12" height="14" fill="#0f0f12" />
      <rect x="24" y="14" width="12" height="2" fill="#c8102e" />
      <path
        d="M25,26 Q18,30 16,40 L16,90 Q16,94 20,94 L40,94 Q44,94 44,90 L44,40 Q42,30 35,26 Z"
        fill="url(#receipt-glass)"
      />
      <path
        d="M19,42 Q19,80 22,90"
        stroke="rgba(255,220,180,.25)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="18" y="48" width="24" height="32" fill="#ffffff" />
      <rect x="18" y="48" width="24" height="32" fill="none" stroke="#c8102e" strokeWidth=".6" />
      <text x="30" y="58" fontFamily="Bricolage Grotesque, sans-serif" fontSize="3.5" textAnchor="middle" fill="#0f0f12" fontWeight="700">
        {brand.split(' ')[0]?.slice(0, 8)}
      </text>
      <text x="30" y="64" fontFamily="Bricolage Grotesque, sans-serif" fontSize="2.8" textAnchor="middle" fill="#c8102e" fontWeight="600">
        {brand.split(' ')[1]?.slice(0, 8) || 'BRAND'}
      </text>
      <line x1="22" y1="67" x2="38" y2="67" stroke="#c8102e" strokeWidth=".5" />
      <text x="30" y="74" fontFamily="Instrument Serif, serif" fontSize="3.5" textAnchor="middle" fill="#0f0f12" fontStyle="italic">
        {varietal.slice(0, 14)}
      </text>
    </svg>
  )
}

function ChargeGroup({ num, name, total, lines }) {
  const visibleLines = lines.filter((line) => line.show !== false)
  if (!visibleLines.length) return null

  return (
    <div className="receipt-charge-group">
      <div className="receipt-charge-head">
        <span className="ch-num">{num}</span>
        <span className="ch-name">{name}</span>
        <span className="ch-line" />
        <span className="ch-sub">{formatMoney(total)}</span>
      </div>
      <dl className="receipt-charge-dl">
        {visibleLines.map((line) => (
          <React.Fragment key={line.label}>
            <dt>{line.label}</dt>
            <dd>{formatMoney(line.value)}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  )
}

const OrderReceipt = ({ order, customer, customerLabel }) => {
  const recipient = order.recipientorders?.[0] || {}
  const store = order.estDetails || {}
  const products = getOrderProducts(order)
  const trackerSteps = getTrackerSteps(order.corpOrderStatus, customer)
  const shippingOrder = isShippingOrder(order)
  const recipientName = [recipient.firstName, recipient.lastName].filter(Boolean).join(' ')
  const deliveryWindow =
    order.deliveryDateTimeToDisplay ||
    formatReceiptDate(order.deliveryDate)

  const storeLines = [
    { label: 'Product Total', value: order.subTotal },
    { label: 'Delivery / Shipping Fee', value: order.deliveryCharge || order.shippingCharges },
    { label: 'Tip', value: order.tipAmt || order.tipAmount },
    { label: 'Promotion Discount', value: order.promodiscAmt || 0 },
    { label: 'Store Credit Card Fee', value: order.storeCCFee }
  ]

  const bevviLines = [
    { label: 'Tax', value: order.taxes },
    { label: 'Service Charge', value: order.serviceCharge },
    { label: 'Service Charge Tax', value: order.serviceChargeTax },
    { label: 'Network Service Charge', value: order.additionalFee, show: (Number(order.additionalFee) || 0) > 0 },
    { label: 'Bevvi Credit Card Fee', value: order.bevviCCFee }
  ]

  return (
    <div className="receipt-pane">
      <div className="receipt-topbar" />
      <div className="receipt-body">
        <header className="receipt-header">
          <div className="receipt-brand">
            <Logo size="receipt" className="receipt-logo" />
            <div className="receipt-est">Alcohol · Made · Easy</div>
          </div>
          <div className="receipt-doc-meta">
            <span className="label">Order Receipt</span>
            Issued · {formatReceiptDate(order.createdAt)}
            <br />
            {customerLabel}
            {recipient.city ? ` · ${recipient.city}` : store.name ? ` · ${store.name}` : ''}
            <br />
            <span className="ord">№ {order.corpOrderNum}</span>
          </div>
        </header>

        <div className="receipt-hero">
          <div>
            <div className="receipt-tagline">
              Alcohol Made Easy<span className="period">.</span>
            </div>
            <div className="receipt-subhead">Your order, seamlessly delivered — start to doorstep.</div>
          </div>
          <div className="receipt-paid-pill">
            <span className="dot" />
            {order.noPayment ? 'No Payment' : 'Paid · By Card'}
          </div>
        </div>

        <div className="receipt-meta-grid receipt-meta-grid-4">
          <div className="receipt-meta-cell">
            <div className="receipt-meta-label">Order Date</div>
            <div className="receipt-meta-value">{formatReceiptDate(order.createdAt)}</div>
          </div>
          <div className="receipt-meta-cell">
            <div className="receipt-meta-label">Placed At</div>
            <div className="receipt-meta-value mono">{formatReceiptTime(order.createdAt)}</div>
          </div>
          <div className="receipt-meta-cell">
            <div className="receipt-meta-label">Service</div>
            <div className="receipt-meta-value">{order.orderType || (order.isDeliveryOrder ? 'Delivery' : 'Pickup')}</div>
          </div>
          <div className="receipt-meta-cell">
            <div className="receipt-meta-label">Reference</div>
            <div className="receipt-meta-value mono">{recipient.externalOrderNumber || '—'}</div>
          </div>
        </div>

        <div className="receipt-main">
          <section className="receipt-main-left">
            <div className="receipt-section-head">
              <span className="num">01</span>
              <span className="label">Your Selection</span>
              <span className="line" />
            </div>

            {products.length === 0 && (
              <p className="receipt-empty">No line items available for this order.</p>
            )}

            {products.map((product, index) => (
              <div className="receipt-item" key={`${product.corpProductId || product.name}-${index}`}>
                <div className="receipt-bottle">
                  <BottleIcon productName={product.name} />
                </div>
                <div>
                  <div className="receipt-item-name">{product.name || 'Product'}</div>
                  <div className="receipt-item-desc">{getProductSubtitle(product)}</div>
                  <div className="receipt-item-tag">{getProductTag(product)}</div>
                </div>
                <div className="receipt-item-price">
                  <div className="receipt-item-qty">
                    QTY · {String(product.quantity || 1).padStart(2, '0')}
                  </div>
                  <div className="receipt-item-amt">{formatMoney(getProductLineTotal(product))}</div>
                </div>
              </div>
            ))}

            <div className="receipt-charges">
              <ChargeGroup
                num="Charge 01"
                name="Store Charge"
                total={getStoreChargeTotal(order)}
                lines={storeLines}
              />
              <ChargeGroup
                num="Charge 02"
                name="Bevvi Tax & Service"
                total={getBevviChargeTotal(order)}
                lines={bevviLines}
              />
            </div>

            <div className="receipt-grand">
              <div className="gl">
                Total Paid
                <small>Settled in full — thank you.</small>
              </div>
              <div className="ga">{formatMoney(order.orderTotal)}</div>
            </div>
          </section>

          <aside className="receipt-main-right">
            <div className="receipt-section-head">
              <span className="num">02</span>
              <span className="label">{shippingOrder ? 'Delivered To' : 'Order For'}</span>
              <span className="line" />
            </div>

            <div className="receipt-recipient">
              <div className="name">{recipientName || 'Recipient'}</div>
              <div className="role">{recipient.companyName || 'Recipient'}</div>
              <div className="addr">
                {recipient.streetAddress}
                {recipient.aptSuiteNum ? `, ${recipient.aptSuiteNum}` : ''}
                <br />
                {[recipient.city, recipient.state, recipient.zipcode].filter(Boolean).join(', ')}
                <br />
                United States
              </div>
              <div className="contact">
                {recipient.email && (
                  <span>
                    <b>Email</b> {recipient.email}
                  </span>
                )}
                {recipient.phoneNum && (
                  <span>
                    <b>Tel</b> {recipient.phoneNum}
                  </span>
                )}
              </div>
            </div>

            {shippingOrder && (
              <div className="receipt-window">
                <div className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <div className="wt">Delivery Window</div>
                  <div className="wv">{deliveryWindow}</div>
                </div>
              </div>
            )}

            <div className="receipt-tracker">
              <div className="receipt-section-head">
                <span className="num">03</span>
                <span className="label">Order Status</span>
                <span className="line" />
              </div>

              <div className="receipt-steps">
                {trackerSteps.map((step) => (
                  <div key={step.key} className={`receipt-step ${step.done ? '' : 'pending'}`}>
                    <div className="dot">{step.done ? '✓' : '·'}</div>
                    <div className="lbl">{step.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer className="receipt-footer">
          <div className="receipt-made">
            Made with <span className="heart">♥</span> in NYC.
            <small>Bevvi · Powering {customerLabel}</small>
          </div>
          <div className="receipt-compliance">
            <div className="age">21+</div>
            <br />
            Please drink responsibly.
          </div>
          <div className="receipt-footer-id">
            <strong>Etail Inc · dba Bevvi</strong>
            <br />
            getbevvi.com · 47 states
          </div>
        </footer>
      </div>
    </div>
  )
}

export default OrderReceipt
