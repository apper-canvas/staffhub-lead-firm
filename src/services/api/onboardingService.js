import mockOnboardingSteps from '@/services/mockData/onboardingSteps.json'

let onboardingSteps = [...mockOnboardingSteps]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const onboardingService = {
  async getOnboardingSteps() {
    await delay(300)
    return [...onboardingSteps]
  },

  async getOnboardingStepById(id) {
    await delay(200)
    const step = onboardingSteps.find(step => step.Id === id)
    if (!step) {
      throw new Error('Onboarding step not found')
    }
    return { ...step }
  },

  async updateStepStatus(id, status) {
    await delay(250)
    const stepIndex = onboardingSteps.findIndex(step => step.Id === id)
    if (stepIndex === -1) {
      throw new Error('Onboarding step not found')
    }
    
    onboardingSteps[stepIndex] = { 
      ...onboardingSteps[stepIndex], 
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : null
    }
    
    return { ...onboardingSteps[stepIndex] }
  },

  async uploadDocument(stepId, file) {
    await delay(500)
    
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
    await delay(300)
    
    // Get all steps and simulate progress
    const allSteps = [...onboardingSteps]
    const completedSteps = allSteps.filter(step => Math.random() > 0.6).map(step => ({
      ...step,
      status: 'completed',
      completedAt: new Date().toISOString()
    }))
    
    const totalSteps = allSteps.length
    const completed = completedSteps.length
    const progress = Math.round((completed / totalSteps) * 100)
    
    return {
      employeeId,
      totalSteps,
      completedSteps: completed,
      progress,
      status: completed === totalSteps ? 'completed' : completed > 0 ? 'in_progress' : 'pending',
      steps: allSteps.map(step => ({
        ...step,
        status: completedSteps.find(cs => cs.Id === step.Id) ? 'completed' : 'pending'
      }))
    }
  }
}