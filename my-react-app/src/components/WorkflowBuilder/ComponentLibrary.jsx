import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Database, 
  Brain, 
  Monitor,
  Info 
} from 'lucide-react';

const ComponentLibrary = () => {
  const components = [
    {
      type: 'user_query',
      name: 'User Query',
      description: 'Entry point for user questions',
      icon: MessageSquare,
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'knowledge_base',
      name: 'Knowledge Base',
      description: 'Document retrieval and search',
      icon: Database,
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      type: 'llm_engine',
      name: 'LLM Engine',
      description: 'AI language model processing',
      icon: Brain,
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
    },
    {
      type: 'output',
      name: 'Output',
      description: 'Display final response',
      icon: Monitor,
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
    },
  ];

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Component Library
        </h2>
        <p className="text-sm text-gray-600">
          Drag components onto the canvas to build your workflow
        </p>
      </div>

      {/* Components */}
      <div className="flex-1 p-6 space-y-4">
        {components.map((component) => {
          const IconComponent = component.icon;
          
          return (
            <motion.div
              key={component.type}
              draggable
              onDragStart={(event) => onDragStart(event, component.type)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-4 rounded-lg border-2 border-dashed cursor-move
                transition-all duration-200 hover:shadow-md
                ${component.borderColor} ${component.bgColor}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${component.color}
                `}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium ${component.textColor}`}>
                    {component.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {component.description}
                  </p>
                </div>
              </div>

              {/* Connection Points Indicator */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-gray-500">Input</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Output</span>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How to use:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Drag components to the canvas</li>
                <li>• Connect components with lines</li>
                <li>• Click components to configure</li>
                <li>• Save and execute your workflow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Tips */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-2">Workflow Tips</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>Start with User Query component</span>
          </div>
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-orange-500" />
            <span>End with Output component</span>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-green-500" />
            <span>Add Knowledge Base for context</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>Use LLM Engine for AI processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;
