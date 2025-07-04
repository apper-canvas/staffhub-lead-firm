import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const DepartmentCard = ({ department, manager, employeeCount, onEdit }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <ApperIcon name="Building" className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
            <p className="text-sm text-gray-600">{department.description}</p>
          </div>
        </div>
        
        <Badge variant="primary">
          {employeeCount} {employeeCount === 1 ? 'Employee' : 'Employees'}
        </Badge>
      </div>
      
      {manager && (
        <div className="flex items-center space-x-3 mb-4">
          <Avatar 
            src={manager.photoUrl} 
            name={`${manager.firstName} ${manager.lastName}`}
            size="sm"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {manager.firstName} {manager.lastName}
            </p>
            <p className="text-xs text-gray-500">Department Manager</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Users" size={14} className="mr-2" />
          <span>{employeeCount} team members</span>
        </div>
        
        <button 
          onClick={() => onEdit(department)}
          className="text-primary hover:text-secondary transition-colors duration-200"
        >
          <ApperIcon name="Edit" size={16} />
        </button>
      </div>
    </motion.div>
  )
}

export default DepartmentCard