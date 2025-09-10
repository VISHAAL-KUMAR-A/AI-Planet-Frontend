import { useState, useEffect, useCallback } from 'react';
import { userQueryComponentAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useUserQueryComponents = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all components
  const fetchComponents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userQueryComponentAPI.getAll();
      setComponents(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch components');
      toast.error('Failed to fetch components');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new component
  const createComponent = useCallback(async (componentData) => {
    setLoading(true);
    try {
      const response = await userQueryComponentAPI.create(componentData);
      const newComponent = response.data;
      setComponents(prev => [...prev, newComponent]);
      toast.success('Component created successfully');
      return newComponent;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create component';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a component
  const updateComponent = useCallback(async (id, componentData) => {
    setLoading(true);
    try {
      const response = await userQueryComponentAPI.update(id, componentData);
      const updatedComponent = response.data;
      setComponents(prev => 
        prev.map(comp => comp.id === id ? updatedComponent : comp)
      );
      toast.success('Component updated successfully');
      return updatedComponent;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to update component';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a component
  const deleteComponent = useCallback(async (id) => {
    setLoading(true);
    try {
      await userQueryComponentAPI.delete(id);
      setComponents(prev => prev.filter(comp => comp.id !== id));
      toast.success('Component deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete component';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get component by ID
  const getComponentById = useCallback((id) => {
    return components.find(comp => comp.id === id);
  }, [components]);

  // Load components on mount
  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  return {
    components,
    loading,
    error,
    fetchComponents,
    createComponent,
    updateComponent,
    deleteComponent,
    getComponentById,
  };
};
