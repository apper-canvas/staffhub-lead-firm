import { motion } from 'framer-motion'

const Loading = ({ type = 'card' }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { 
      backgroundPosition: '200px 0',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  }
  
  const shimmerClass = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200px_100%] animate-pulse"
  
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-full ${shimmerClass}`} />
              <div className="flex-1">
                <div className={`h-4 rounded mb-2 ${shimmerClass}`} />
                <div className={`h-3 rounded w-2/3 ${shimmerClass}`} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className={`h-3 rounded ${shimmerClass}`} />
              <div className={`h-3 rounded w-4/5 ${shimmerClass}`} />
              <div className={`h-3 rounded w-3/4 ${shimmerClass}`} />
            </div>
            
            <div className="flex space-x-2 mt-4">
              <div className={`h-8 w-16 rounded ${shimmerClass}`} />
              <div className={`h-8 w-20 rounded ${shimmerClass}`} />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6">
          <div className={`h-6 rounded w-1/4 mb-4 ${shimmerClass}`} />
          
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full ${shimmerClass}`} />
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className={`h-4 rounded ${shimmerClass}`} />
                  <div className={`h-4 rounded ${shimmerClass}`} />
                  <div className={`h-4 rounded ${shimmerClass}`} />
                  <div className={`h-4 rounded w-2/3 ${shimmerClass}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${shimmerClass}`} />
              <div className={`w-16 h-6 rounded ${shimmerClass}`} />
            </div>
            
            <div className={`h-8 rounded w-1/2 mb-2 ${shimmerClass}`} />
            <div className={`h-4 rounded w-3/4 ${shimmerClass}`} />
          </motion.div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  )
}

export default Loading