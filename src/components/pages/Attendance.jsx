import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import AttendanceGrid from '@/components/molecules/AttendanceGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { attendanceService } from '@/services/api/attendanceService'
import { employeeService } from '@/services/api/employeeService'

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    loadAttendance()
    loadEmployees()
  }, [])
  
  const loadAttendance = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await attendanceService.getAll()
      setAttendance(data)
    } catch (err) {
      setError('Failed to load attendance data')
      toast.error('Failed to load attendance data')
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
  
  const getTodayStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayAttendance = attendance.filter(record => record.date === today)
    const activeEmployees = employees.filter(emp => emp.status === 'active')
    
    const present = todayAttendance.filter(record => record.status === 'present').length
    const absent = todayAttendance.filter(record => record.status === 'absent').length
    const late = todayAttendance.filter(record => record.status === 'late').length
    const halfDay = todayAttendance.filter(record => record.status === 'half-day').length
    
    const total = activeEmployees.length
    const marked = todayAttendance.length
    const unmarked = total - marked
    
    return {
      present,
      absent,
      late,
      halfDay,
      total,
      marked,
      unmarked,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
    }
  }
  
  const getWeeklyStats = () => {
    const weekStart = startOfWeek(selectedDate)
    const weekEnd = endOfWeek(selectedDate)
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    const weeklyAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= weekStart && recordDate <= weekEnd
    })
    
    const dailyStats = weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayAttendance = weeklyAttendance.filter(record => record.date === dayStr)
      const activeEmployees = employees.filter(emp => emp.status === 'active')
      
      return {
        date: dayStr,
        present: dayAttendance.filter(record => record.status === 'present').length,
        total: activeEmployees.length,
        rate: activeEmployees.length > 0 ? Math.round((dayAttendance.filter(record => record.status === 'present').length / activeEmployees.length) * 100) : 0
      }
    })
    
    return dailyStats
  }
  
  const markAttendance = async (employeeId, status) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const existingRecord = attendance.find(record => 
        record.employeeId === employeeId && record.date === today
      )
      
      if (existingRecord) {
        await attendanceService.update(existingRecord.Id, {
          ...existingRecord,
          status,
          checkIn: status === 'present' ? '09:00' : existingRecord.checkIn,
          checkOut: status === 'present' ? '17:00' : existingRecord.checkOut
        })
        toast.success('Attendance updated successfully')
      } else {
        await attendanceService.create({
          employeeId,
          date: today,
          status,
          checkIn: status === 'present' ? '09:00' : null,
          checkOut: status === 'present' ? '17:00' : null
        })
        toast.success('Attendance marked successfully')
      }
      
      await loadAttendance()
    } catch (err) {
      toast.error('Failed to mark attendance')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Attendance" 
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
          title="Attendance" 
          onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadAttendance} />
        </div>
      </div>
    )
  }
  
  const todayStats = getTodayStats()
  const weeklyStats = getWeeklyStats()
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Attendance" 
        onMobileMenuToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        actions={
          <div className="flex items-center space-x-3">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <Button variant="primary">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
        }
      />
      
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">
            Today's Attendance Overview
          </h2>
          <p className="text-gray-600">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        
        {/* Today's Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-success to-emerald-600 rounded-lg">
                <ApperIcon name="CheckCircle" className="text-white" size={24} />
              </div>
              <Badge variant="success">{todayStats.attendanceRate}%</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Present Today</h3>
            <p className="text-3xl font-bold gradient-text">
              {todayStats.present} / {todayStats.total}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-error to-red-600 rounded-lg">
                <ApperIcon name="XCircle" className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Absent Today</h3>
            <p className="text-3xl font-bold gradient-text">{todayStats.absent}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-warning to-amber-600 rounded-lg">
                <ApperIcon name="Clock" className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Late Today</h3>
            <p className="text-3xl font-bold gradient-text">{todayStats.late}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg">
                <ApperIcon name="AlertCircle" className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Not Marked</h3>
            <p className="text-3xl font-bold gradient-text">{todayStats.unmarked}</p>
          </motion.div>
        </div>
        
        {/* Weekly Attendance Grid */}
        <div className="mb-8">
          <AttendanceGrid 
            attendance={attendance}
            employees={employees}
            selectedDate={selectedDate}
          />
        </div>
        
        {/* Weekly Stats Chart */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance Trend</h3>
          
          <div className="space-y-4">
            {weeklyStats.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {format(new Date(day.date), 'd')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {format(new Date(day.date), 'EEEE')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(day.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {day.present} / {day.total}
                    </p>
                    <p className="text-sm text-gray-600">Present</p>
                  </div>
                  
                  <div className="w-20">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${day.rate}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center mt-1">{day.rate}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance