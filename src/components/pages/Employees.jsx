import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import SearchBar from '@/components/molecules/SearchBar'
import EmployeeCard from '@/components/molecules/EmployeeCard'
import EmployeeForm from '@/components/organisms/EmployeeForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { employeeService } from '@/services/api/employeeService'
import { departmentService } from '@/services/api/departmentService'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    loadEmployees()
    loadDepartments()
  }, [])
  
  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await employeeService.getAll()
      setEmployees(data)
      setFilteredEmployees(data)
    } catch (err) {
      setError('Failed to load employees')
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }
  
  const loadDepartments = async () => {
    try {
      const data = await departmentService.getAll()
      setDepartments(data)
    } catch (err) {
      toast.error('Failed to load departments')
    }
  }
  
  const handleSearch = (searchTerm, filters) => {
    let filtered = employees
    
    // Apply search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(emp => emp.department === filters.department)
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(emp => emp.status === filters.status)
    }
    
    setFilteredEmployees(filtered)
  }
  
  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setShowForm(true)
  }
  
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }
  
  const handleArchiveEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to archive ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.update(employee.Id, { ...employee, status: 'inactive' })
        await loadEmployees()
        toast.success('Employee archived successfully')
      } catch (err) {
        toast.error('Failed to archive employee')
      }
    }
  }
  
  const handleFormSave = async (savedEmployee) => {
    setShowForm(false)
    setEditingEmployee(null)
    await loadEmployees()
  }
  
  const handleFormCancel = () => {
    setShowForm(false)
    setEditingEmployee(null)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Employees" 
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
          title="Employees" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadEmployees} />
        </div>
      </div>
    )
  }
  
  const searchFilters = [
    {
      key: 'department',
      label: 'Departments',
      options: departments.map(dept => ({
        value: dept.name,
        label: dept.name
      }))
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'on-leave', label: 'On Leave' }
      ]
    }
  ]
  
  if (showForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title={editingEmployee ? 'Edit Employee' : 'Add Employee'} 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
          actions={
            <Button variant="ghost" onClick={handleFormCancel}>
              <ApperIcon name="X" size={16} className="mr-2" />
              Cancel
            </Button>
          }
        />
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-card p-6">
              <EmployeeForm
                employee={editingEmployee}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Employees" 
        onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        actions={
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name="Grid3x3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name="List" size={16} />
              </button>
            </div>
            <Button variant="primary" onClick={handleAddEmployee}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Employee
            </Button>
          </div>
        }
      />
      
      <div className="p-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search employees by name, email, or role..."
          filters={searchFilters}
          className="mb-6"
        />
        
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              All Employees ({filteredEmployees.length})
            </h2>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Active: {filteredEmployees.filter(emp => emp.status === 'active').length}</span>
              <span>•</span>
              <span>Inactive: {filteredEmployees.filter(emp => emp.status === 'inactive').length}</span>
              <span>•</span>
              <span>On Leave: {filteredEmployees.filter(emp => emp.status === 'on-leave').length}</span>
            </div>
          </div>
        </div>
        
        {filteredEmployees.length === 0 ? (
          <Empty
            title="No employees found"
            description="No employees match your current search criteria. Try adjusting your filters or add a new employee."
            icon="Users"
            action={{
              label: 'Add Employee',
              icon: 'Plus',
              onClick: handleAddEmployee
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }
          >
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EmployeeCard
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onArchive={handleArchiveEmployee}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Employees