import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';
import { DEFAULT_USER_QUERY_CONFIG, UI_CONSTANTS } from '../../utils/constants';

const ComponentForm = ({ 
  component = null, 
  isOpen, 
  onClose, 
  onSave, 
  loading = false 
}) => {
  const [formData, setFormData] = useState(DEFAULT_USER_QUERY_CONFIG);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name || '',
        description: component.description || '',
        placeholder_text: component.placeholder_text || '',
        max_length: component.max_length || 500,
      });
    } else {
      setFormData(DEFAULT_USER_QUERY_CONFIG);
    }
    setErrors({});
  }, [component, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    } else if (formData.name.length > UI_CONSTANTS.MAX_COMPONENT_NAME_LENGTH) {
      newErrors.name = `Name must be less than ${UI_CONSTANTS.MAX_COMPONENT_NAME_LENGTH} characters`;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > UI_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be less than ${UI_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (!formData.placeholder_text.trim()) {
      newErrors.placeholder_text = 'Placeholder text is required';
    }

    if (!formData.max_length || formData.max_length < 1) {
      newErrors.max_length = 'Max length must be at least 1';
    } else if (formData.max_length > UI_CONSTANTS.MAX_QUERY_LENGTH) {
      newErrors.max_length = `Max length cannot exceed ${UI_CONSTANTS.MAX_QUERY_LENGTH}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSave(formData);
      onClose();
    } catch {
      // Error is handled in the hook
    }
  };

  const handleChange = (field) => (e) => {
    const value = field === 'max_length' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
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
        className="card w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {component ? 'Edit Component' : 'Create New Component'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter component name"
              maxLength={UI_CONSTANTS.MAX_COMPONENT_NAME_LENGTH}
            />
            {errors.name && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-1 text-sm text-red-600"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </motion.div>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
              className={`textarea-field ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Describe what this component does"
              maxLength={UI_CONSTANTS.MAX_DESCRIPTION_LENGTH}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </motion.div>
              ) : (
                <div />
              )}
              <span className="text-xs text-gray-500">
                {formData.description.length}/{UI_CONSTANTS.MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          {/* Placeholder Text Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder Text *
            </label>
            <input
              type="text"
              value={formData.placeholder_text}
              onChange={handleChange('placeholder_text')}
              className={`input-field ${errors.placeholder_text ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter placeholder text for user input"
            />
            {errors.placeholder_text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-1 text-sm text-red-600"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.placeholder_text}
              </motion.div>
            )}
          </div>

          {/* Max Length Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Query Length *
            </label>
            <input
              type="number"
              value={formData.max_length}
              onChange={handleChange('max_length')}
              min="1"
              max={UI_CONSTANTS.MAX_QUERY_LENGTH}
              className={`input-field ${errors.max_length ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="500"
            />
            {errors.max_length && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-1 text-sm text-red-600"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.max_length}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {component ? 'Update' : 'Create'} Component
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ComponentForm;
