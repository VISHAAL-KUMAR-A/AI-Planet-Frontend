// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Edit3, Trash2, MessageSquare, Calendar, User } from 'lucide-react';
import { getRelativeTime } from '../../utils/formatters';

const ComponentCard = ({ 
  component, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelected = false 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`card p-6 cursor-pointer transition-all duration-200 hover:shadow-xl border-2 ${
        isSelected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-primary-300'
      }`}
      onClick={() => onSelect?.(component)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{component.name}</h3>
            <p className="text-sm text-gray-500">User Query Component</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(component);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Edit component"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete component"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {component.description}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Placeholder:</span>
          <span className="text-gray-700 font-medium">
            "{component.placeholder_text}"
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Max Length:</span>
          <span className="text-gray-700 font-medium">
            {component.max_length} characters
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created {getRelativeTime(component.created_at)}</span>
          </div>
          {component.updated_at !== component.created_at && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Updated {getRelativeTime(component.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-3 h-3 bg-primary-500 rounded-full"
        />
      )}
    </motion.div>
  );
};

export default ComponentCard;
