import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Monitor, Settings, Eye } from 'lucide-react';

const OutputNode = ({ data, isConnectable }) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-orange-200 hover:border-orange-400 transition-colors">
      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center">
            <Monitor className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {data.name || 'Output'}
          </span>
        </div>
        <Settings className="w-3 h-3 text-gray-400" />
      </div>

      {/* Node Content */}
      <div className="text-xs text-gray-600 mb-3">
        {data.description || 'Display final response'}
      </div>

      {/* Configuration Preview */}
      {data.configuration && (
        <div className="text-xs bg-orange-50 p-2 rounded border space-y-1">
          <div className="text-orange-700">
            Format: {data.configuration.format || 'text'}
          </div>
          {data.configuration.include_metadata && (
            <div className="flex items-center space-x-1 text-orange-600">
              <Eye className="w-3 h-3" />
              <span>Include metadata</span>
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
        className="w-3 h-3 bg-orange-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-400 border-2 border-white"
      />
    </div>
  );
};

export default memo(OutputNode);
