import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import custom components
import ComponentLibrary from './ComponentLibrary';
import ComponentConfigPanel from './ComponentConfigPanel';
import ExecutionPanel from './ExecutionPanel';

// Import custom node types
import UserQueryNode from './nodes/UserQueryNode';
import KnowledgeBaseNode from './nodes/KnowledgeBaseNode';
import LLMEngineNode from './nodes/LLMEngineNode';
import OutputNode from './nodes/OutputNode';

// Import hooks
import { useWorkflows } from '../../hooks/useWorkflows';

// Import icons
import { Play, Save, Trash2, Eye, Settings } from 'lucide-react';

const nodeTypes = {
  user_query: UserQueryNode,
  knowledge_base: KnowledgeBaseNode,
  llm_engine: LLMEngineNode,
  output: OutputNode,
};

const initialNodes = [];
const initialEdges = [];

const WorkflowBuilderContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isExecutionPanelOpen, setIsExecutionPanelOpen] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState(null);

  const reactFlowWrapper = useRef(null);
  const { createEnhancedWorkflow, executeEnhancedWorkflow, validateWorkflow, loading } = useWorkflows();
  const reactFlowInstance = useReactFlow();

  // Handle connection between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle drag over for drop functionality
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop of components from library
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          name: getDefaultNodeName(type),
          description: getDefaultNodeDescription(type),
          configuration: getDefaultConfiguration(type),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Get default node names
  const getDefaultNodeName = (type) => {
    const names = {
      user_query: 'User Input',
      knowledge_base: 'Knowledge Base',
      llm_engine: 'LLM Engine',
      output: 'Output',
    };
    return names[type] || 'Unknown Component';
  };

  // Get default node descriptions
  const getDefaultNodeDescription = (type) => {
    const descriptions = {
      user_query: 'Accepts user queries',
      knowledge_base: 'Document knowledge retrieval',
      llm_engine: 'AI language model processing',
      output: 'Displays final response',
    };
    return descriptions[type] || 'Component description';
  };

  // Get default configurations
  const getDefaultConfiguration = (type) => {
    const configs = {
      user_query: {
        placeholder_text: 'Enter your question...',
        max_length: 500,
      },
      knowledge_base: {
        retrieval_method: 'similarity',
        max_results: 5,
        documents: [],
      },
      llm_engine: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
        system_prompt: 'You are a helpful assistant.',
      },
      output: {
        format: 'text',
        include_metadata: false,
      },
    };
    return configs[type] || {};
  };

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setIsConfigPanelOpen(true);
  }, []);

  // Save workflow
  const handleSaveWorkflow = async () => {
    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type || 'default',
        })),
      };

      const savedWorkflow = await createEnhancedWorkflow(workflowData);
      setCurrentWorkflowId(savedWorkflow.id);
    } catch (error) {
      console.error('Failed to save workflow:', error);
    }
  };

  // Execute workflow
  const handleExecuteWorkflow = () => {
    if (currentWorkflowId) {
      setIsExecutionPanelOpen(true);
    } else {
      alert('Please save the workflow first before executing');
    }
  };

  // Clear workflow
  const handleClearWorkflow = () => {
    if (window.confirm('Are you sure you want to clear the entire workflow?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setCurrentWorkflowId(null);
      setWorkflowName('New Workflow');
      setWorkflowDescription('');
    }
  };

  // Update node configuration
  const updateNodeConfiguration = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none outline-none text-gray-900"
                placeholder="Workflow Name"
              />
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="text-sm text-gray-600 bg-transparent border-none outline-none block mt-1"
                placeholder="Workflow description..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveWorkflow}
              disabled={loading}
              className="btn-secondary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExecuteWorkflow}
              disabled={!currentWorkflowId || loading}
              className="btn-primary flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Execute
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearWorkflow}
              className="btn-danger flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Component Library */}
        <ComponentLibrary />

        {/* Workflow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
            {/* Canvas Instructions */}
            {nodes.length === 0 && (
              <Panel position="top-center">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Build Your Workflow
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Drag components from the left panel onto this canvas to start building your workflow. 
                    Connect components by dragging from the output handles to input handles.
                  </p>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Configuration Panel */}
        {isConfigPanelOpen && selectedNode && (
          <ComponentConfigPanel
            node={selectedNode}
            isOpen={isConfigPanelOpen}
            onClose={() => setIsConfigPanelOpen(false)}
            onUpdate={updateNodeConfiguration}
          />
        )}
      </div>

      {/* Execution Panel */}
      {isExecutionPanelOpen && (
        <ExecutionPanel
          workflowId={currentWorkflowId}
          isOpen={isExecutionPanelOpen}
          onClose={() => setIsExecutionPanelOpen(false)}
        />
      )}
    </div>
  );
};

const WorkflowBuilder = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
