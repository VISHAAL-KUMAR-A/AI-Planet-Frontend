import { useState, useCallback, useEffect } from 'react';
import { workflowAPI, chatAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execute a workflow with a query
  const executeWorkflow = useCallback(async (workflowId, query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.execute({
        workflow_id: workflowId,
        query: query  // Backend expects 'query' for workflow execution
      });
      const execution = response.data;
      toast.success('Workflow executed successfully');
      return execution;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to execute workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send chat message through workflow
  const sendChatMessage = useCallback(async (workflowId, message) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatAPI.query({
        workflow_id: workflowId,
        message: message
      });
      const chatResponse = response.data;
      return chatResponse;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to send chat message';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new workflow
  const createWorkflow = useCallback(async (workflowData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.create(workflowData);
      const newWorkflow = response.data;
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast.success('Workflow created successfully');
      return newWorkflow;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create an enhanced workflow with nodes and edges
  const createEnhancedWorkflow = useCallback(async (workflowData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.createEnhanced(workflowData);
      const newWorkflow = response.data;
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast.success('Enhanced workflow created successfully');
      return newWorkflow;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create enhanced workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Execute workflow with enhanced feedback
  const executeEnhancedWorkflow = useCallback(async (executionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.executeEnhanced(executionData);
      const execution = response.data;
      toast.success('Workflow executed successfully');
      return execution;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to execute workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all workflows
  const getAllWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.getAll();
      setWorkflows(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch workflows';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load workflows on component mount
  useEffect(() => {
    getAllWorkflows();
  }, [getAllWorkflows]);

  // Get workflow by ID
  const getWorkflowById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.getById(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update workflow
  const updateWorkflow = useCallback(async (id, workflowData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.update(id, workflowData);
      const updatedWorkflow = response.data;
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === id ? updatedWorkflow : workflow
      ));
      toast.success('Workflow updated successfully');
      return updatedWorkflow;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to update workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete workflow
  const deleteWorkflow = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await workflowAPI.delete(id);
      setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
      toast.success('Workflow deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate workflow
  const validateWorkflow = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowAPI.validate(id);
      const validation = response.data;
      if (validation.is_valid) {
        toast.success('Workflow is valid and ready to execute');
      } else {
        toast.error(`Workflow validation failed: ${validation.errors?.join(', ')}`);
      }
      return validation;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to validate workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    workflows,
    loading,
    error,
    executeWorkflow,
    sendChatMessage,
    createWorkflow,
    createEnhancedWorkflow,
    executeEnhancedWorkflow,
    getAllWorkflows,
    getWorkflowById,
    updateWorkflow,
    deleteWorkflow,
    validateWorkflow,
  };
};
