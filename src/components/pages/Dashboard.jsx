import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import StatCard from '@/components/molecules/StatCard'
import AttendanceGrid from '@/components/molecules/AttendanceGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { employeeService } from '@/services/api/employeeService'
import { departmentService } from '@/services/api/departmentService'
import { attendanceService } from '@/services/api/attendanceService'

const Dashboard = () => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [employeesData, departmentsData, attendanceData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        attendanceService.getAll()
      ])
      
      setEmployees(employeesData)
      setDepartments(departmentsData)
      setAttendance(attendanceData)
    } catch (err) {
      setError('Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  const getTodaysAttendance = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return attendance.filter(record => record.date === today)
  }
  
  const getActiveEmployees = () => {
    return employees.filter(emp => emp.status === 'active')
  }
  
  const getPresentToday = () => {
    const todaysAttendance = getTodaysAttendance()
    return todaysAttendance.filter(record => record.status === 'present').length
  }
  
  const getAttendanceRate = () => {
    const activeEmployees = getActiveEmployees()
    const presentToday = getPresentToday()
    
    if (activeEmployees.length === 0) return 0
    return Math.round((presentToday / activeEmployees.length) * 100)
  }
  
  const getDepartmentStats = () => {
    const stats = departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept.name)
      return {
        ...dept,
        employeeCount: deptEmployees.length,
        activeCount: deptEmployees.filter(emp => emp.status === 'active').length
      }
    })
    
    return stats.sort((a, b) => b.employeeCount - a.employeeCount).slice(0, 5)
  }
  
  const getRecentActivity = () => {
    const recentAttendance = attendance
      .filter(record => {
        const recordDate = new Date(record.date)
        const daysDiff = Math.floor((new Date() - recordDate) / (1000 * 60 * 60 * 24))
        return daysDiff <= 7
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
    
    return recentAttendance.map(record => {
      const employee = employees.find(emp => emp.Id === record.employeeId)
      return {
        ...record,
        employee
      }
    })
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Dashboard" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Loading type="stats" />
          <div className="mt-8">
            <Loading type="table" />
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Dashboard" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    )
  }
  
  const activeEmployees = getActiveEmployees()
  const attendanceRate = getAttendanceRate()
  const departmentStats = getDepartmentStats()
  const recentActivity = getRecentActivity()
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Dashboard" 
        onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        actions={
          <Button variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Quick Action
          </Button>
        }
      />
      
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your team today, {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={employees.length}
            icon="Users"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Active Employees"
            value={activeEmployees.length}
            icon="UserCheck"
            trend="up"
            trendValue="+5%"
          />
          <StatCard
            title="Departments"
            value={departments.length}
            icon="Building"
          />
          <StatCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon="Clock"
            trend={attendanceRate >= 80 ? "up" : "down"}
            trendValue={`${attendanceRate >= 80 ? '+' : '-'}${Math.abs(attendanceRate - 80)}%`}
          />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Attendance Overview */}
          <div className="xl:col-span-2">
            <AttendanceGrid 
              attendance={attendance}
              employees={employees}
              selectedDate={new Date()}
            />
          </div>
          
          {/* Department Overview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Department Overview
              </h3>
              
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <motion.div
                    key={dept.Id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Building" className="text-white" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{dept.name}</h4>
                        <p className="text-sm text-gray-500">
                          {dept.activeCount} active of {dept.employeeCount} total
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{dept.employeeCount}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <motion.div
                    key={`${activity.employeeId}-${activity.date}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'present' ? 'bg-green-500' :
                      activity.status === 'absent' ? 'bg-red-500' :
                      activity.status === 'late' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.employee?.firstName} {activity.employee?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.status} on {format(new Date(activity.date), 'MMM d')}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {activity.checkIn && format(new Date(`2000-01-01T${activity.checkIn}`), 'HH:mm')}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard