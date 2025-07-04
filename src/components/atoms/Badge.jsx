const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary",
    secondary: "bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary",
    success: "bg-gradient-to-r from-success/10 to-emerald-500/10 text-success",
    warning: "bg-gradient-to-r from-warning/10 to-amber-500/10 text-warning",
    error: "bg-gradient-to-r from-error/10 to-red-500/10 text-error",
    info: "bg-gradient-to-r from-info/10 to-blue-500/10 text-info"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}

export default Badge