import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import DepartmentCard from '@/components/molecules/DepartmentCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { departmentService } from '@/services/api/departmentService'
import { employeeService } from '@/services/api/employeeService'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    loadDepartments()
    loadEmployees()
  }, [])
  
  const loadDepartments = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await departmentService.getAll()
      setDepartments(data)
    } catch (err) {
      setError('Failed to load departments')
      toast.error('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }
  
  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (err) {
      toast.error('Failed to load employees')
    }
  }
  
  const handleEditDepartment = (department) => {
    toast.info('Edit department functionality coming soon!')
  }
  
  const getDepartmentManager = (department) => {
    if (!department.managerId) return null
    return employees.find(emp => emp.Id === department.managerId)
  }
  
  const getDepartmentEmployeeCount = (departmentName) => {
    return employees.filter(emp => emp.department === departmentName).length
  }
  
  const getDepartmentStats = () => {
    const totalEmployees = employees.length
    const totalDepartments = departments.length
    const avgEmployeesPerDept = totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0
    const largestDept = departments.reduce((max, dept) => {
      const count = getDepartmentEmployeeCount(dept.name)
      return count > getDepartmentEmployeeCount(max?.name || '') ? dept : max
    }, departments[0])
    
    return {
      totalEmployees,
      totalDepartments,
      avgEmployeesPerDept,
      largestDept: largestDept?.name || 'N/A'
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Departments" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Loading type="card" />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Departments" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadDepartments} />
        </div>
      </div>
    )
  }
  
  const stats = getDepartmentStats()
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Departments" 
        onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        actions={
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Department
          </Button>
        }
      />
      
      <div className="p-6">
        {/* Department Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <ApperIcon name="Building" className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Departments</h3>
            <p className="text-3xl font-bold gradient-text">{stats.totalDepartments}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-success to-emerald-600 rounded-lg">
                <ApperIcon name="Users" className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Employees</h3>
            <p className="text-3xl font-bold gradient-text">{stats.totalEmployees}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-warning to-amber-600 rounded-lg">
                <ApperIcon name="TrendingUp" className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Avg per Department</h3>
            <p className="text-3xl font-bold gradient-text">{stats.avgEmployeesPerDept}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-info to-blue-600 rounded-lg">
                <ApperIcon name="Award" className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Largest Department</h3>
            <p className="text-lg font-bold gradient-text">{stats.largestDept}</p>
          </motion.div>
        </div>
        
        {/* Department Cards */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Departments ({departments.length})
          </h2>
        </div>
        
        {departments.length === 0 ? (
          <Empty
            title="No departments found"
            description="Get started by creating your first department to organize your employees."
            icon="Building"
            action={{
              label: 'Add Department',
              icon: 'Plus',
              onClick: () => toast.info('Add department functionality coming soon!')
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {departments.map((department, index) => (
              <motion.div
                key={department.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DepartmentCard
                  department={department}
                  manager={getDepartmentManager(department)}
                  employeeCount={getDepartmentEmployeeCount(department.name)}
                  onEdit={handleEditDepartment}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Departments