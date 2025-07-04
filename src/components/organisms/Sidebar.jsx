import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
const navItems = [
    { to: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/employees', label: 'Employees', icon: 'Users' },
    { to: '/departments', label: 'Departments', icon: 'Building' },
    { to: '/attendance', label: 'Attendance', icon: 'Clock' },
    { to: '/onboarding', label: 'Onboarding', icon: 'CheckSquare' },
  ]
  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <ApperIcon name="Users" className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">StaffHub</h1>
          <p className="text-sm text-gray-600">Employee Management</p>
        </div>
      </div>
      
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="text-white" size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">HR Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white shadow-lg">
        {sidebarContent}
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="relative w-64 bg-white shadow-lg"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  )
}

export default Sidebar