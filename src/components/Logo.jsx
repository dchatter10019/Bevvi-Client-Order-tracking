import { useCustomer } from '../customers/CustomerContext'

const Logo = ({ size = 'default', className = '' }) => {
  const { config } = useCustomer() || {}

  const sizes = {
    small: { className: 'h-9 w-9', width: 72, height: 72 },
    default: { className: 'h-12 w-12', width: 96, height: 96 },
    large: { className: 'h-16 w-16', width: 128, height: 128 },
    receipt: { className: 'h-[64px] w-[64px]', width: 64, height: 64 }
  }

  const { className: sizeClass, width, height } = sizes[size] || sizes.default

  return (
    <img
      src={config?.logo || '/bevvi-logo.png'}
      alt={config?.label || 'Bevvi'}
      width={width}
      height={height}
      className={`block shrink-0 object-contain object-left ${sizeClass} ${className}`}
      decoding="async"
    />
  )
}

export default Logo
