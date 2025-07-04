import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Avatar = ({ src, alt, name, size = 'md', className = '', showStatus = false, status = 'active' }) => {
  const [imageError, setImageError] = useState(false)
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  }
  
  const statusColors = {
    active: 'bg-green-400',
    inactive: 'bg-gray-400',
    'on-leave': 'bg-yellow-400'
  }
  
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  
  const baseClasses = `${sizes[size]} rounded-full flex items-center justify-center font-medium text-white bg-gradient-to-br from-primary to-secondary relative ${className}`
  
  return (
    <div className={baseClasses}>
      {src && !imageError ? (
        <img 
          src={src} 
          alt={alt || name} 
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="select-none">
          {name ? getInitials(name) : <ApperIcon name="User" size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />}
        </span>
      )}
      
      {showStatus && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`} />
      )}
    </div>
  )
}

export default Avatar