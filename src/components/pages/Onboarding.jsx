import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import DocumentUpload from '@/components/molecules/DocumentUpload'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { onboardingService } from '@/services/api/onboardingService'
import { employeeService } from '@/services/api/employeeService'

const Onboarding = () => {
  const [steps, setSteps] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(1) // Default to first employee
  const [employees, setEmployees] = useState([])
  const [expandedStep, setExpandedStep] = useState(null)
  const [uploadingSteps, setUploadingSteps] = useState(new Set())

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployee) {
      loadOnboardingData()
    }
  }, [selectedEmployee])

  const loadEmployees = async () => {
    try {
      const employeesData = await employeeService.getAll()
      setEmployees(employeesData)
    } catch (err) {
      console.error('Error loading employees:', err)
    }
  }

  const loadOnboardingData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [stepsData, progressData] = await Promise.all([
        onboardingService.getOnboardingSteps(),
        onboardingService.getEmployeeOnboardingProgress(selectedEmployee)
      ])
      
      setSteps(stepsData)
      setProgress(progressData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load onboarding data')
    } finally {
      setLoading(false)
    }
  }

  const handleStepComplete = async (stepId) => {
    try {
      await onboardingService.updateStepStatus(stepId, 'completed')
      await loadOnboardingData()
      toast.success('Step completed successfully!')
    } catch (err) {
      toast.error('Failed to update step status')
    }
  }

  const handleDocumentUpload = async (stepId, file) => {
    try {
      setUploadingSteps(prev => new Set(prev).add(stepId))
      
      const result = await onboardingService.uploadDocument(stepId, file)
      
      // Update employee onboarding status
      await employeeService.updateOnboardingStatus(selectedEmployee, stepId, 'completed', result.documentUrl)
      
      await loadOnboardingData()
      toast.success(`Document uploaded successfully: ${result.fileName}`)
    } catch (err) {
      toast.error(err.message || 'Failed to upload document')
    } finally {
      setUploadingSteps(prev => {
        const newSet = new Set(prev)
        newSet.delete(stepId)
        return newSet
      })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'personal': return 'User'
      case 'financial': return 'CreditCard'
      case 'technical': return 'Monitor'
      case 'training': return 'GraduationCap'
      default: return 'FileText'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle'
      case 'in_progress': return 'Clock'
      case 'pending': return 'Circle'
      default: return 'Circle'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'in_progress': return 'text-yellow-600'
      case 'pending': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Employee Onboarding</h1>
        <p className="text-gray-600">Track and manage employee onboarding progress</p>
      </div>

      {/* Employee Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Employee
        </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(parseInt(e.target.value))}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {employees.map(employee => (
            <option key={employee.Id} value={employee.Id}>
              {employee.firstName} {employee.lastName} - {employee.position}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Overview */}
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Onboarding Progress</h2>
            <Badge 
              variant={progress.status === 'completed' ? 'success' : progress.status === 'in_progress' ? 'warning' : 'secondary'}
              className="capitalize"
            >
              {progress.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{progress.completedSteps}</div>
              <div className="text-sm text-gray-600">of {progress.totalSteps} steps</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Onboarding Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Onboarding Checklist</h2>
        
        {steps.map((step, index) => (
          <motion.div
            key={step.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
          >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedStep(expandedStep === step.Id ? null : step.Id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <ApperIcon 
                      name={getStatusIcon(step.status)} 
                      className={getStatusColor(step.status)}
                      size={24}
                    />
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <ApperIcon name={getCategoryIcon(step.category)} size={16} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getPriorityColor(step.priority)}>
                        {step.priority} priority
                      </Badge>
                      <span className="text-xs text-gray-500">• {step.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {step.status === 'completed' && (
                    <Badge variant="success">Completed</Badge>
                  )}
                  <ApperIcon 
                    name={expandedStep === step.Id ? 'ChevronUp' : 'ChevronDown'}
                    size={20}
                    className="text-gray-400"
                  />
                </div>
              </div>
            </div>
            
            {expandedStep === step.Id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 p-6"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                    <p className="text-gray-600">{step.instructions}</p>
                  </div>
                  
                  {step.requiredDocuments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
                      <div className="space-y-2">
                        {step.requiredDocuments.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <ApperIcon name="FileText" size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">{doc}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <DocumentUpload
                          onUpload={(file) => handleDocumentUpload(step.Id, file)}
                          loading={uploadingSteps.has(step.Id)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          maxSize={5 * 1024 * 1024}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    {step.status !== 'completed' && (
                      <Button
                        onClick={() => handleStepComplete(step.Id)}
                        className="flex items-center gap-2"
                        size="sm"
                      >
                        <ApperIcon name="Check" size={16} />
                        Mark as Complete
                      </Button>
                    )}
                    
                    {step.status === 'completed' && (
                      <Button
                        variant="outline"
                        onClick={() => handleStepComplete(step.Id)}
                        className="flex items-center gap-2"
                        size="sm"
                      >
                        <ApperIcon name="RotateCcw" size={16} />
                        Mark as Incomplete
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Onboarding