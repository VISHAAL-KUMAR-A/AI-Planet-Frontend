import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, Upload, Trash2, FileText, CheckCircle } from 'lucide-react';
import { componentValidationAPI, documentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ComponentConfigPanel = ({ node, isOpen, onClose, onUpdate }) => {
  const [config, setConfig] = useState(node.data.configuration || {});
  const [name, setName] = useState(node.data.name || '');
  const [description, setDescription] = useState(node.data.description || '');
  const [validation, setValidation] = useState({ valid: true, errors: [], warnings: [] });
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    setConfig(node.data.configuration || {});
    setName(node.data.name || '');
    setDescription(node.data.description || '');
    
    // Load documents if this is a knowledge base component
    if (node.type === 'knowledge_base') {
      loadDocuments();
    }
  }, [node]);

  const loadDocuments = async () => {
    try {
      const response = await documentAPI.getByComponent(node.id);
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const validateConfiguration = async () => {
    try {
      const response = await componentValidationAPI.validate({
        component_type: node.type,
        configuration: config
      });
      setValidation(response.data);
    } catch (error) {
      console.error('Validation failed:', error);
      setValidation({ valid: false, errors: ['Validation service unavailable'], warnings: [] });
    }
  };

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    // Validate after a short delay
    setTimeout(() => {
      validateConfiguration();
    }, 500);
  };

  const handleSave = () => {
    onUpdate(node.id, {
      name,
      description,
      configuration: config
    });
    toast.success('Component configuration saved');
    onClose();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await documentAPI.upload(node.id, formData);
      toast.success('Document uploaded successfully');
      loadDocuments(); // Reload documents list
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const renderConfigurationForm = () => {
    switch (node.type) {
      case 'user_query':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={config.placeholder_text || ''}
                onChange={(e) => handleConfigChange('placeholder_text', e.target.value)}
                className="input-field"
                placeholder="Enter your question..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Length
              </label>
              <input
                type="number"
                value={config.max_length || 500}
                onChange={(e) => handleConfigChange('max_length', parseInt(e.target.value))}
                className="input-field"
                min="1"
                max="10000"
              />
            </div>
          </div>
        );

      case 'knowledge_base':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retrieval Method
              </label>
              <select
                value={config.retrieval_method || 'similarity'}
                onChange={(e) => handleConfigChange('retrieval_method', e.target.value)}
                className="input-field"
              >
                <option value="similarity">Similarity Search</option>
                <option value="keyword">Keyword Search</option>
                <option value="hybrid">Hybrid Search</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Results
              </label>
              <input
                type="number"
                value={config.max_results || 5}
                onChange={(e) => handleConfigChange('max_results', parseInt(e.target.value))}
                className="input-field"
                min="1"
                max="20"
              />
            </div>
            
            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload documents'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, TXT, DOC, DOCX files supported
                  </span>
                </label>
              </div>

              {/* Document List */}
              {documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.document_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{doc.filename}</span>
                        {doc.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'llm_engine':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={config.model || 'gpt-3.5-turbo'}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="input-field"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature ({config.temperature || 0.7})
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature || 0.7}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                value={config.max_tokens || 1000}
                onChange={(e) => handleConfigChange('max_tokens', parseInt(e.target.value))}
                className="input-field"
                min="1"
                max="4000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Prompt
              </label>
              <textarea
                value={config.system_prompt || ''}
                onChange={(e) => handleConfigChange('system_prompt', e.target.value)}
                className="textarea-field"
                rows="3"
                placeholder="You are a helpful assistant..."
              />
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                value={config.format || 'text'}
                onChange={(e) => handleConfigChange('format', e.target.value)}
                className="input-field"
              >
                <option value="text">Plain Text</option>
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-metadata"
                checked={config.include_metadata || false}
                onChange={(e) => handleConfigChange('include_metadata', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="include-metadata" className="text-sm text-gray-700">
                Include execution metadata
              </label>
            </div>
          </div>
        );

      default:
        return <div>No configuration available for this component type.</div>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Configure Component
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Component Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Component name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea-field"
                    rows="2"
                    placeholder="Component description"
                  />
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Configuration</h3>
              {renderConfigurationForm()}
            </div>

            {/* Validation Results */}
            {(!validation.valid || validation.warnings.length > 0) && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Validation</h3>
                
                {/* Errors */}
                {validation.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">Errors</span>
                    </div>
                    <ul className="text-xs text-red-700 space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {validation.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-800">Warnings</span>
                    </div>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!validation.valid}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComponentConfigPanel;
