import axios from 'axios';

// Base API configuration  
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed in future
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// User Query Component API functions
export const userQueryComponentAPI = {
  // Get all user query components
  getAll: () => api.get('/api/components/user-query'),
  
  // Get specific user query component
  getById: (id) => api.get(`/api/components/user-query/${id}`),
  
  // Create new user query component
  create: (data) => api.post('/api/components/user-query', data),
  
  // Update user query component
  update: (id, data) => api.put(`/api/components/user-query/${id}`, data),
  
  // Delete user query component
  delete: (id) => api.delete(`/api/components/user-query/${id}`),
};

// Query execution API functions
export const queryAPI = {
  // Execute a query
  execute: (data) => api.post('/api/queries', data),
  
  // Get query details
  getById: (id) => api.get(`/api/queries/${id}`),
  
  // Get all queries
  getAll: () => api.get('/api/queries/'),
  
  // Get queries by component ID
  getByComponentId: (componentId) => api.get(`/api/queries?component_id=${componentId}`),
  
  // Get queries by workflow ID
  getByWorkflowId: (workflowId) => api.get(`/api/queries?workflow_id=${workflowId}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
  info: () => api.get('/'),
};

export default api;
