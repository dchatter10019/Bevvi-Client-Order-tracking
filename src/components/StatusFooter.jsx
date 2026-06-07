import { APP_VERSION } from '../utils/constants'

const StatusFooter = ({ isLoading = false, error = '' }) => {
  const status = error ? 'Error' : isLoading ? 'Syncing' : 'Ready'
  const statusClass = error ? 'is-error' : isLoading ? 'is-loading' : 'is-ready'

  return (
    <footer className="monitor-status-footer">
      <span className={`monitor-status-pill ${statusClass}`}>{status}</span>
      <span className="monitor-status-version">Bevvi Order Monitor v{APP_VERSION}</span>
    </footer>
  )
}

export default StatusFooter
