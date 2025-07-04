import employeesData from '@/services/mockData/employees.json'

let employees = [...employeesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const employeeService = {
  async getAll() {
    await delay(300)
    return [...employees]
  },
  
  async getById(id) {
    await delay(200)
    const employee = employees.find(emp => emp.Id === id)
    if (!employee) {
      throw new Error('Employee not found')
    }
    return { ...employee }
  },
  
  async create(employeeData) {
    await delay(400)
    const newEmployee = {
      ...employeeData,
      Id: Math.max(...employees.map(emp => emp.Id)) + 1
    }
    employees.push(newEmployee)
    return { ...newEmployee }
  },
  
  async update(id, employeeData) {
    await delay(350)
    const index = employees.findIndex(emp => emp.Id === id)
    if (index === -1) {
      throw new Error('Employee not found')
    }
    
    employees[index] = { ...employees[index], ...employeeData, Id: id }
    return { ...employees[index] }
  },
  
  async delete(id) {
    await delay(250)
    const index = employees.findIndex(emp => emp.Id === id)
    if (index === -1) {
      throw new Error('Employee not found')
    }
    
    const deletedEmployee = employees.splice(index, 1)[0]
    return { ...deletedEmployee }
  }
}