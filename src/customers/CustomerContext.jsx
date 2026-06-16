import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  CUSTOMER_LIST,
  CUSTOMER_LOCKED,
  DEFAULT_CUSTOMER_ID,
  UNKNOWN_HOST_CUSTOMER_ID,
  getCustomerConfig
} from './customerRegistry'
import { applyTheme } from './applyTheme'

const CustomerContext = createContext(null)

export function CustomerProvider({ children }) {
  const [customerId, setCustomerId] = useState(DEFAULT_CUSTOMER_ID)
  const config = getCustomerConfig(customerId) || CUSTOMER_LIST[0] || null

  useEffect(() => {
    applyTheme(config)
  }, [config])

  if (UNKNOWN_HOST_CUSTOMER_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900">Customer not configured</h1>
          <p className="mt-2 text-sm text-slate-600">
            No dashboard config exists for <strong>{UNKNOWN_HOST_CUSTOMER_ID}</strong>.
            Add <code className="text-xs">customers/{UNKNOWN_HOST_CUSTOMER_ID}.md</code> and redeploy.
          </p>
        </div>
      </div>
    )
  }

  return (
    <CustomerContext.Provider
      value={{
        customerId,
        setCustomerId,
        config,
        customers: CUSTOMER_LIST,
        locked: CUSTOMER_LOCKED || CUSTOMER_LIST.length <= 1
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  return useContext(CustomerContext)
}
