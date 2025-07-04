import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ onSearch, placeholder = "Search employees...", filters = [], className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  
  useEffect(() => {
    onSearch(searchTerm, activeFilters)
  }, [searchTerm, activeFilters, onSearch])
  
  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value === 'all' ? undefined : value
    }))
  }
  
  const clearFilters = () => {
    setSearchTerm('')
    setActiveFilters({})
  }
  
  return (
    <div className={`bg-white rounded-xl p-4 shadow-card ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || 'all'}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">All {filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          
          {(searchTerm || Object.keys(activeFilters).some(key => activeFilters[key])) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <ApperIcon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar