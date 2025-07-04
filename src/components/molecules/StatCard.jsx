import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ title, value, icon, trend, trendValue, className = '' }) => {
  const getTrendColor = () => {
    if (!trend) return 'text-gray-500'
    return trend === 'up' ? 'text-success' : 'text-error'
  }
  
  const getTrendIcon = () => {
    if (!trend) return null
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown'
  }
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <ApperIcon name={icon} className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="text-3xl font-bold gradient-text">{value}</p>
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center space-x-2">
          <ApperIcon name={getTrendIcon()} className={getTrendColor()} size={16} />
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </motion.div>
  )
}

export default StatCard