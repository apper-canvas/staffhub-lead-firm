import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const EmployeeCard = ({ employee, onEdit, onArchive }) => {
  const navigate = useNavigate()
  
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'error'
      case 'on-leave': return 'warning'
      default: return 'default'
    }
  }
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'inactive': return 'Inactive'
      case 'on-leave': return 'On Leave'
      default: return status
    }
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/employees/${employee.Id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar 
            src={employee.photoUrl} 
            name={`${employee.firstName} ${employee.lastName}`}
            size="lg"
            showStatus
            status={employee.status}
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.role}</p>
            <p className="text-sm text-gray-500">{employee.department}</p>
          </div>
        </div>
        
        <Badge variant={getStatusVariant(employee.status)}>
          {getStatusLabel(employee.status)}
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Mail" size={14} className="mr-2" />
          <span>{employee.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" size={14} className="mr-2" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" size={14} className="mr-2" />
          <span>Started {new Date(employee.startDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex space-x-2 pt-4 border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation()
            onEdit(employee)
          }}
        >
          <ApperIcon name="Edit" size={14} className="mr-1" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation()
            onArchive(employee)
          }}
        >
          <ApperIcon name="Archive" size={14} className="mr-1" />
          Archive
        </Button>
      </div>
    </motion.div>
  )
}

export default EmployeeCard