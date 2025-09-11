import { useState } from 'react'
import UserQueryComponent from './components/UserQuery/UserQueryComponent'
import WorkflowBuilder from './components/WorkflowBuilder/WorkflowBuilder'
import './utils/testAPI' // Make test functions available in console

function App() {
  const [currentView, setCurrentView] = useState('components') // 'components' or 'builder'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                AI Workflow Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('components')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'components'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Components
              </button>
              <button
                onClick={() => setCurrentView('builder')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'builder'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Workflow Builder
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {currentView === 'components' ? <UserQueryComponent /> : <WorkflowBuilder />}
    </div>
  )
}

export default App
