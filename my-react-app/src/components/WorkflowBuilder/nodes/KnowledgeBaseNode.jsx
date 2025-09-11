import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Settings, FileText } from 'lucide-react';

const KnowledgeBaseNode = ({ data, isConnectable }) => {
  const documentCount = data.configuration?.documents?.length || 0;

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-green-200 hover:border-green-400 transition-colors">
      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
            <Database className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {data.name || 'Knowledge Base'}
          </span>
        </div>
        <Settings className="w-3 h-3 text-gray-400" />
      </div>

      {/* Node Content */}
      <div className="text-xs text-gray-600 mb-3">
        {data.description || 'Document retrieval and search'}
      </div>

      {/* Configuration Preview */}
      {data.configuration && (
        <div className="text-xs bg-green-50 p-2 rounded border space-y-1">
          <div className="text-green-700">
            Method: {data.configuration.retrieval_method || 'similarity'}
          </div>
          <div className="text-green-700">
            Max Results: {data.configuration.max_results || 5}
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <FileText className="w-3 h-3" />
            <span>{documentCount} document{documentCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-400 border-2 border-white"
      />
    </div>
  );
};

export default memo(KnowledgeBaseNode);
