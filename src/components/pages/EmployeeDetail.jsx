import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { employeeService } from '@/services/api/employeeService'
import { attendanceService } from '@/services/api/attendanceService'

const EmployeeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    loadEmployeeData()
  }, [id])
  
  const loadEmployeeData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [employeeData, attendanceData] = await Promise.all([
        employeeService.getById(parseInt(id)),
        attendanceService.getAll()
      ])
      
      setEmployee(employeeData)
      setAttendance(attendanceData.filter(record => record.employeeId === parseInt(id)))
    } catch (err) {
      setError('Failed to load employee data')
      toast.error('Failed to load employee data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleEdit = () => {
    navigate('/employees', { state: { editEmployee: employee } })
  }
  
  const handleArchive = async () => {
    if (window.confirm(`Are you sure you want to archive ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.update(employee.Id, { ...employee, status: 'inactive' })
        toast.success('Employee archived successfully')
        navigate('/employees')
      } catch (err) {
        toast.error('Failed to archive employee')
      }
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Employee Details" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    )
  }
  
  if (error || !employee) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Employee Details" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Error message={error || 'Employee not found'} onRetry={loadEmployeeData} />
        </div>
      </div>
    )
  }
  
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
  
  const getRecentAttendance = () => {
    return attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30)
  }
  
  const getAttendanceStats = () => {
    const last30Days = attendance.slice(-30)
    const present = last30Days.filter(record => record.status === 'present').length
    const absent = last30Days.filter(record => record.status === 'absent').length
    const late = last30Days.filter(record => record.status === 'late').length
    
    return { present, absent, late, total: last30Days.length }
  }
  
  const attendanceStats = getAttendanceStats()
  const recentAttendance = getRecentAttendance()
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'attendance', label: 'Attendance', icon: 'Clock' },
    { id: 'contact', label: 'Contact', icon: 'Phone' }
  ]
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Employee Details" 
        onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        actions={
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate('/employees')}>
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back
            </Button>
            <Button variant="secondary" onClick={handleEdit}>
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Edit
            </Button>
            <Button variant="error" onClick={handleArchive}>
              <ApperIcon name="Archive" size={16} className="mr-2" />
              Archive
            </Button>
          </div>
        }
      />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Employee Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-card p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-6">
                <Avatar 
                  src={employee.photoUrl} 
                  name={`${employee.firstName} ${employee.lastName}`}
                  size="2xl"
                  showStatus
                  status={employee.status}
                />
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-lg text-gray-600">{employee.role}</p>
                  <p className="text-gray-500">{employee.department}</p>
                  <div className="mt-2">
                    <Badge variant={getStatusVariant(employee.status)}>
                      {getStatusLabel(employee.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-sm text-gray-500">Started</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(new Date(employee.startDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-card mb-6 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ApperIcon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Mail" className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{employee.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Phone" className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900">{employee.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Building" className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="text-gray-900">{employee.department}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Briefcase" className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <p className="text-gray-900">{employee.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                        <p className="text-sm text-gray-600">Present Days</p>
                      </div>
                      
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                        <p className="text-sm text-gray-600">Absent Days</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                        <p className="text-sm text-gray-600">Late Days</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-blue-600">
                          {attendanceStats.total > 0 ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0}%
                        </p>
                        <p className="text-sm text-gray-600">Attendance Rate</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'attendance' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
                  
                  <div className="space-y-2">
                    {recentAttendance.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            record.status === 'present' ? 'bg-green-500' :
                            record.status === 'absent' ? 'bg-red-500' :
                            record.status === 'late' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">
                              {format(new Date(record.date), 'EEEE, MMM d, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">{record.status}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {record.checkIn && (
                            <p className="text-sm text-gray-900">
                              In: {format(new Date(`2000-01-01T${record.checkIn}`), 'HH:mm')}
                            </p>
                          )}
                          {record.checkOut && (
                            <p className="text-sm text-gray-600">
                              Out: {format(new Date(`2000-01-01T${record.checkOut}`), 'HH:mm')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Mail" className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-gray-900">{employee.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Phone" className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-gray-900">{employee.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {employee.emergencyContact && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="User" className="text-gray-400" size={16} />
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-gray-900">{employee.emergencyContact.name || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Heart" className="text-gray-400" size={16} />
                          <div>
                            <p className="text-sm text-gray-500">Relationship</p>
                            <p className="text-gray-900">{employee.emergencyContact.relationship || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Phone" className="text-gray-400" size={16} />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900">{employee.emergencyContact.phone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetail