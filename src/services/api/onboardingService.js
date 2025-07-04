import { toast } from 'react-toastify'

export const onboardingService = {
  async getOnboardingSteps() {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "status" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "assigned_to" } },
          { field: { "Name": "document_url" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "Tags" } }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.fetchRecords('onboarding_step', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching onboarding steps:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  },

  async getOnboardingStepById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "status" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "assigned_to" } },
          { field: { "Name": "document_url" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "Tags" } }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.getRecordById('onboarding_step', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching onboarding step with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  async updateStepStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: id,
          status: status
        }]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.updateRecord('onboarding_step', params)
      
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
        console.error("Error updating onboarding step status:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  async uploadDocument(stepId, file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files.')
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.')
    }

    // Simulate upload and return document URL
    const documentUrl = `https://example.com/documents/${stepId}-${Date.now()}-${file.name}`
    
    return {
      documentUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    }
  },

  async getEmployeeOnboardingProgress(employeeId) {
    try {
      const allSteps = await this.getOnboardingSteps()
      
      // Simulate progress based on step status
      const completedSteps = allSteps.filter(step => step.status === 'completed')
      const totalSteps = allSteps.length
      const completed = completedSteps.length
      const progress = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0
      
      return {
        employeeId,
        totalSteps,
        completedSteps: completed,
        progress,
        status: completed === totalSteps ? 'completed' : completed > 0 ? 'in_progress' : 'pending',
        steps: allSteps
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching employee onboarding progress:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return {
        employeeId,
        totalSteps: 0,
        completedSteps: 0,
        progress: 0,
        status: 'pending',
        steps: []
      }
    }
  }
}