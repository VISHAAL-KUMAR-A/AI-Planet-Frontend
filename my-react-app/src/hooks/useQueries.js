import { useState, useCallback } from 'react';
import { queryAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execute a query
  const executeQuery = useCallback(async (queryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await queryAPI.execute(queryData);
      const newQuery = response.data;
      setQueries(prev => [newQuery, ...prev]);
      toast.success('Query executed successfully');
      return newQuery;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to execute query';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get query by ID
  const getQueryById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await queryAPI.getById(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch query';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get queries by component ID
  const getQueriesByComponent = useCallback(async (componentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await queryAPI.getByComponentId(componentId);
      setQueries(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch queries';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all queries
  const getAllQueries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await queryAPI.getAll();
      setQueries(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch queries';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    queries,
    loading,
    error,
    executeQuery,
    getQueryById,
    getQueriesByComponent,
    getAllQueries,
  };
};
