import { useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { AuthContext } from '@/App'

const Header = ({ title, actions, onMobileMenuToggle }) => {
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {actions}
            {isAuthenticated && (
              <Button variant="ghost" onClick={logout} size="sm">
                <ApperIcon name="LogOut" size={16} className="mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header