import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Play, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useWorkflows } from '../../hooks/useWorkflows';
import { formatDateTime } from '../../utils/formatters';

const ExecutionPanel = ({ workflowId, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [executionResults, setExecutionResults] = useState([]);
  const [currentExecution, setCurrentExecution] = useState(null);
  
  const { executeEnhancedWorkflow, loading } = useWorkflows();

  const handleExecute = async () => {
    if (!query.trim() || loading) return;

    try {
      setCurrentExecution({ status: 'running', query });
      
      const result = await executeEnhancedWorkflow({
        workflow_id: workflowId,
        query: query.trim()
      });

      setCurrentExecution(null);
      setExecutionResults(prev => [result, ...prev]);
      setQuery('');
    } catch (error) {
      console.error('Execution failed:', error);
      setCurrentExecution({
        status: 'failed',
        query,
        error: error.message || 'Execution failed'
      });
    }
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Workflow Execution
                </h2>
                <p className="text-sm text-gray-500">
                  Test your workflow with queries and see detailed execution steps
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Query Input */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
                  placeholder="Enter your query to test the workflow..."
                  className="flex-1 input-field"
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExecute}
                  disabled={!query.trim() || loading}
                  className="btn-primary flex items-center"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Execute
                </motion.button>
              </div>
            </div>

            {/* Execution Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Current Execution */}
              {currentExecution && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Current Execution
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      <span className="text-sm font-medium text-blue-900">
                        Executing: "{currentExecution.query}"
                      </span>
                    </div>
                    {currentExecution.error && (
                      <p className="text-sm text-red-600 mt-2">
                        Error: {currentExecution.error}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Execution History */}
              {executionResults.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Execution History
                  </h3>
                  <div className="space-y-4">
                    {executionResults.map((result, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        {/* Execution Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              "{result.query}"
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>Status: {result.status}</span>
                              {result.total_processing_time_ms && (
                                <span>Duration: {result.total_processing_time_ms}ms</span>
                              )}
                              {result.created_at && (
                                <span>{formatDateTime(result.created_at)}</span>
                              )}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            result.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status}
                          </div>
                        </div>

                        {/* Final Response */}
                        {result.result && (
                          <div className="bg-gray-50 rounded p-3 mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Response:</strong> {result.result.response}
                            </p>
                          </div>
                        )}

                        {/* Execution Steps */}
                        {result.execution_steps && result.execution_steps.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                              Execution Steps
                            </h5>
                            <div className="space-y-2">
                              {result.execution_steps.map((step, stepIndex) => (
                                <div
                                  key={stepIndex}
                                  className={`border rounded p-3 ${getStepColor(step.status)}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      {getStepIcon(step.status)}
                                      <span className="text-sm font-medium">
                                        {step.step_number}. {step.component_name}
                                      </span>
                                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                        {step.component_type}
                                      </span>
                                    </div>
                                    {step.processing_time_ms && (
                                      <span className="text-xs text-gray-500">
                                        {step.processing_time_ms}ms
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Step Details */}
                                  <div className="text-xs space-y-1">
                                    {step.started_at && (
                                      <div className="text-gray-600">
                                        Started: {formatDateTime(step.started_at)}
                                      </div>
                                    )}
                                    {step.output_data && step.output_data.response && (
                                      <div className="text-gray-700 bg-white p-2 rounded">
                                        Output: {step.output_data.response}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {executionResults.length === 0 && !currentExecution && (
                <div className="text-center py-12">
                  <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Execute
                  </h3>
                  <p className="text-gray-500">
                    Enter a query above to test your workflow and see detailed execution steps.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExecutionPanel;
