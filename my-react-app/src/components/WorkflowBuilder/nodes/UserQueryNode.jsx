import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, Settings } from 'lucide-react';

const UserQueryNode = ({ data, isConnectable }) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-blue-200 hover:border-blue-400 transition-colors">
      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {data.name || 'User Query'}
          </span>
        </div>
        <Settings className="w-3 h-3 text-gray-400" />
      </div>

      {/* Node Content */}
      <div className="text-xs text-gray-600 mb-3">
        {data.description || 'Accepts user queries'}
      </div>

      {/* Configuration Preview */}
      {data.configuration && (
        <div className="text-xs bg-blue-50 p-2 rounded border">
          <div className="text-blue-700">
            Max Length: {data.configuration.max_length || 500}
          </div>
          {data.configuration.placeholder_text && (
            <div className="text-blue-600 mt-1 truncate">
              Placeholder: "{data.configuration.placeholder_text}"
            </div>
          )}
        </div>
      )}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
      />
    </div>
  );
};

export default memo(UserQueryNode);
