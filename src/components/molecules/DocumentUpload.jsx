import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const DocumentUpload = ({ 
  onUpload, 
  loading = false, 
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024,
  className = ""
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (file) => {
    // Validate file size
    if (file.size > maxSize) {
      alert(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`)
      return
    }

    // Validate file type
    const allowedTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    const mimeType = file.type
    
    const isValidType = allowedTypes.some(type => 
      file.name.toLowerCase().endsWith(type) || 
      mimeType.includes(type.replace('.', ''))
    )
    
    if (!isValidType) {
      alert(`Invalid file type. Please select: ${accept}`)
      return
    }

    setSelectedFile(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-2">
          <ApperIcon 
            name="Upload" 
            size={48} 
            className={`${dragOver ? 'text-primary' : 'text-gray-400'}`}
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Drop files here or{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: {accept.replace(/\./g, '').toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">
              Maximum size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon name="FileText" size={20} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={loading}
              >
                <ApperIcon name="X" size={16} />
              </Button>
              
              <Button
                onClick={handleUpload}
                disabled={loading}
                size="sm"
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Upload" size={16} />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DocumentUpload