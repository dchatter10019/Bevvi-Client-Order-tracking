import { useEffect, useState } from 'react'
import { APP_VERSION } from '../utils/constants'
import { fetchAppVersion } from '../utils/api'

const StatusFooter = ({ isLoading = false, error = '' }) => {
  const [version, setVersion] = useState(APP_VERSION)
  const status = error ? 'Error' : isLoading ? 'Syncing' : 'Ready'
  const statusClass = error ? 'is-error' : isLoading ? 'is-loading' : 'is-ready'

  useEffect(() => {
    const controller = new AbortController()

    fetchAppVersion({ signal: controller.signal })
      .then((apiVersion) => {
        if (apiVersion) setVersion(apiVersion)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  return (
    <footer className="monitor-status-footer">
      <span className={`monitor-status-pill ${statusClass}`}>{status}</span>
      <span className="monitor-status-version">Bevvi Order Monitor v{version}</span>
    </footer>
  )
}

export default StatusFooter
