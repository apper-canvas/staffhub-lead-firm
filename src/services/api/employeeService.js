import { toast } from 'react-toastify'

export const employeeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "first_name" } },
          { field: { "Name": "last_name" } },
          { field: { "Name": "email" } },
          { field: { "Name": "phone" } },
          { field: { "Name": "job_title" } },
          { field: { "Name": "hire_date" } },
          { field: { "Name": "salary" } },
          { field: { "Name": "address" } },
          { field: { "Name": "city" } },
          { field: { "Name": "state" } },
          { field: { "Name": "zip_code" } },
          { field: { "Name": "bio" } },
          { field: { "Name": "skills" } },
          { field: { "Name": "onboarding" } },
          { field: { "Name": "department_id" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "Tags" } }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.fetchRecords('employee', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employees:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  },
  
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "first_name" } },
          { field: { "Name": "last_name" } },
          { field: { "Name": "email" } },
          { field: { "Name": "phone" } },
          { field: { "Name": "job_title" } },
          { field: { "Name": "hire_date" } },
          { field: { "Name": "salary" } },
          { field: { "Name": "address" } },
          { field: { "Name": "city" } },
          { field: { "Name": "state" } },
          { field: { "Name": "zip_code" } },
          { field: { "Name": "bio" } },
          { field: { "Name": "skills" } },
          { field: { "Name": "onboarding" } },
          { field: { "Name": "department_id" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "Tags" } }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.getRecordById('employee', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching employee with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },
  
  async create(employeeData) {
    try {
      const params = {
        records: [{
          Name: employeeData.Name || `${employeeData.first_name} ${employeeData.last_name}`,
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
          email: employeeData.email,
          phone: employeeData.phone,
          job_title: employeeData.job_title,
          hire_date: employeeData.hire_date,
          salary: parseFloat(employeeData.salary) || 0,
          address: employeeData.address,
          city: employeeData.city,
          state: employeeData.state,
          zip_code: employeeData.zip_code,
          bio: employeeData.bio,
          skills: employeeData.skills,
          onboarding: employeeData.onboarding,
          department_id: parseInt(employeeData.department_id) || null,
          Owner: employeeData.Owner,
          Tags: employeeData.Tags
        }]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.createRecord('employee', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating employee:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },
  
  async update(id, employeeData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: employeeData.Name || `${employeeData.first_name} ${employeeData.last_name}`,
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
          email: employeeData.email,
          phone: employeeData.phone,
          job_title: employeeData.job_title,
          hire_date: employeeData.hire_date,
          salary: parseFloat(employeeData.salary) || 0,
          address: employeeData.address,
          city: employeeData.city,
          state: employeeData.state,
          zip_code: employeeData.zip_code,
          bio: employeeData.bio,
          skills: employeeData.skills,
          onboarding: employeeData.onboarding,
          department_id: parseInt(employeeData.department_id) || null,
          Owner: employeeData.Owner,
          Tags: employeeData.Tags
        }]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.updateRecord('employee', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating employee:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },
  
  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.deleteRecord('employee', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting employee:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}