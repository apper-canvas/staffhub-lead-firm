import attendanceData from '@/services/mockData/attendance.json'

let attendance = [...attendanceData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const attendanceService = {
  async getAll() {
    await delay(300)
    return [...attendance]
  },
  
  async getById(id) {
    await delay(200)
    const record = attendance.find(att => att.Id === id)
    if (!record) {
      throw new Error('Attendance record not found')
    }
    return { ...record }
  },
  
  async create(attendanceData) {
    await delay(400)
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(att => att.Id)) + 1
    }
    attendance.push(newRecord)
    return { ...newRecord }
  },
  
  async update(id, attendanceData) {
    await delay(350)
    const index = attendance.findIndex(att => att.Id === id)
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    
    attendance[index] = { ...attendance[index], ...attendanceData, Id: id }
    return { ...attendance[index] }
  },
  
  async delete(id) {
    await delay(250)
    const index = attendance.findIndex(att => att.Id === id)
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    
    const deletedRecord = attendance.splice(index, 1)[0]
    return { ...deletedRecord }
  }
}