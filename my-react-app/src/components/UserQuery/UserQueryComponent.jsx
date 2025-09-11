import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Search, Settings, Play } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Import components
import ComponentCard from './ComponentCard';
import ComponentForm from './ComponentForm';
import ChatInterface from './ChatInterface';

// Import hooks
import { useUserQueryComponents } from '../../hooks/useUserQueryComponents';
import { useWorkflows } from '../../hooks/useWorkflows';

// Import constants
import { PREDEFINED_WORKFLOWS } from '../../utils/constants';

const UserQueryComponent = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(PREDEFINED_WORKFLOWS.SIMPLE_QA.id);

  const {
    components,
    loading,
    createComponent,
    updateComponent,
    deleteComponent,
  } = useUserQueryComponents();

  const {
    workflows: _workflows,
    loading: _workflowLoading,
    getAllWorkflows: _getAllWorkflows,
    validateWorkflow: _validateWorkflow,
  } = useWorkflows();

  // Filter components based on search term
  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateComponent = () => {
    setEditingComponent(null);
    setIsFormOpen(true);
  };

  const handleEditComponent = (component) => {
    setEditingComponent(component);
    setIsFormOpen(true);
  };

  const handleDeleteComponent = async (component) => {
    if (window.confirm(`Are you sure you want to delete "${component.name}"?`)) {
      await deleteComponent(component.id);
      if (selectedComponent?.id === component.id) {
        setSelectedComponent(null);
      }
    }
  };

  const handleSaveComponent = async (componentData) => {
    if (editingComponent) {
      const updated = await updateComponent(editingComponent.id, componentData);
      if (selectedComponent?.id === editingComponent.id) {
        setSelectedComponent(updated);
      }
    } else {
      await createComponent(componentData);
    }
    setIsFormOpen(false);
    setEditingComponent(null);
  };

  // Start chat with selected predefined workflow
  const handleStartWorkflowChat = () => {
    const workflowData = Object.values(PREDEFINED_WORKFLOWS).find(w => w.id === selectedWorkflowId);
    if (workflowData) {
      setSelectedWorkflow(workflowData);
      setIsChatOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Workflow Builder</h1>
                <p className="text-gray-600">User Query Components</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateComponent}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Component
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Components List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Components ({components.length})
                </h2>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search components..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && components.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-gray-600">Loading components...</span>
              </div>
            )}

            {/* Empty State */}
            {!loading && components.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No components yet</h3>
                <p className="text-gray-500 mb-6">Create your first User Query Component to get started</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateComponent}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Component
                </motion.button>
              </motion.div>
            )}

            {/* Components Grid */}
            {!loading && filteredComponents.length > 0 && (
              <motion.div
                layout
                className="grid gap-6 md:grid-cols-2"
              >
                <AnimatePresence mode="popLayout">
                  {filteredComponents.map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      onEdit={handleEditComponent}
                      onDelete={handleDeleteComponent}
                      onSelect={setSelectedComponent}
                      isSelected={selectedComponent?.id === component.id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* No Search Results */}
            {!loading && searchTerm && filteredComponents.length === 0 && components.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching components</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workflow Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Test Workflows
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Workflow
                  </label>
                  <select
                    value={selectedWorkflowId}
                    onChange={(e) => setSelectedWorkflowId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Object.values(PREDEFINED_WORKFLOWS).map((workflow) => (
                      <option key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Show selected workflow description */}
                  {(() => {
                    const selectedWorkflowData = Object.values(PREDEFINED_WORKFLOWS).find(w => w.id === selectedWorkflowId);
                    return selectedWorkflowData && (
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedWorkflowData.description}
                      </p>
                    );
                  })()}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartWorkflowChat}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with Stack
                </motion.button>
              </div>
            </motion.div>


            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Components</span>
                  <span className="font-semibold text-primary-600">{components.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Selected</span>
                  <span className="font-semibold text-gray-900">
                    {selectedComponent ? '1' : '0'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Component Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <ComponentForm
            component={editingComponent}
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingComponent(null);
            }}
            onSave={handleSaveComponent}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Chat Interface Modal */}
      <AnimatePresence>
        {isChatOpen && selectedWorkflow && (
          <ChatInterface
            workflow={selectedWorkflow}
            isOpen={isChatOpen}
            onClose={() => {
              setIsChatOpen(false);
              setSelectedWorkflow(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserQueryComponent;
