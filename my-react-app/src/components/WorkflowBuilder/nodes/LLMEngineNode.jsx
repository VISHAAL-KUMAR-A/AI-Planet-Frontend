import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Brain, Settings, Zap } from 'lucide-react';

const LLMEngineNode = ({ data, isConnectable }) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-purple-200 hover:border-purple-400 transition-colors">
      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center">
            <Brain className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {data.name || 'LLM Engine'}
          </span>
        </div>
        <Settings className="w-3 h-3 text-gray-400" />
      </div>

      {/* Node Content */}
      <div className="text-xs text-gray-600 mb-3">
        {data.description || 'AI language model processing'}
      </div>

      {/* Configuration Preview */}
      {data.configuration && (
        <div className="text-xs bg-purple-50 p-2 rounded border space-y-1">
          <div className="text-purple-700">
            Model: {data.configuration.model || 'gpt-3.5-turbo'}
          </div>
          <div className="text-purple-700">
            Temperature: {data.configuration.temperature || 0.7}
          </div>
          <div className="text-purple-700">
            Max Tokens: {data.configuration.max_tokens || 1000}
          </div>
          {data.configuration.system_prompt && (
            <div className="flex items-center space-x-1 text-purple-600">
              <Zap className="w-3 h-3" />
              <span>Custom prompt</span>
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
        className="w-3 h-3 bg-purple-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400 border-2 border-white"
      />
    </div>
  );
};

export default memo(LLMEngineNode);
