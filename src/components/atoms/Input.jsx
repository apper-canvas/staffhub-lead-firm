import { forwardRef } from 'react'

const Input = forwardRef(({ 
  type = 'text', 
  placeholder, 
  className = '', 
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "block w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const stateClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500/50" 
    : "border-gray-300 focus:border-primary focus:ring-primary/50"
  
  const classes = `${baseClasses} ${stateClasses} ${className}`
  
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={classes}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input