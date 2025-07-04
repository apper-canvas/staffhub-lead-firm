import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import Badge from '@/components/atoms/Badge'

const AttendanceGrid = ({ attendance, employees, selectedDate = new Date() }) => {
  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  
  const getAttendanceForEmployeeAndDate = (employeeId, date) => {
    return attendance.find(record => 
      record.employeeId === employeeId && 
      isSameDay(new Date(record.date), date)
    )
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success'
      case 'absent': return 'error'
      case 'late': return 'warning'
      case 'half-day': return 'info'
      default: return 'default'
    }
  }
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'P'
      case 'absent': return 'A'
      case 'late': return 'L'
      case 'half-day': return 'H'
      default: return '-'
    }
  }
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
              {weekDays.map(day => (
                <th key={day.toISOString()} className="text-center py-3 px-2 font-medium text-gray-700 min-w-[80px]">
                  <div className="text-xs text-gray-500">{format(day, 'EEE')}</div>
                  <div className="text-sm">{format(day, 'd')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.slice(0, 10).map(employee => (
              <tr key={employee.Id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{employee.department}</div>
                </td>
                {weekDays.map(day => {
                  const attendanceRecord = getAttendanceForEmployeeAndDate(employee.Id, day)
                  const status = attendanceRecord?.status
                  
                  return (
                    <td key={day.toISOString()} className="text-center py-3 px-2">
                      {status ? (
                        <Badge variant={getStatusColor(status)} size="sm">
                          {getStatusLabel(status)}
                        </Badge>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Badge variant="success" size="sm">P</Badge>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="error" size="sm">A</Badge>
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="warning" size="sm">L</Badge>
          <span>Late</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="info" size="sm">H</Badge>
          <span>Half Day</span>
        </div>
      </div>
    </div>
  )
}

export default AttendanceGrid