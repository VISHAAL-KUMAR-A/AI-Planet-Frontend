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

// User Query Component API functions (moved to componentAPI.userQuery below)

// Query execution API functions (legacy - keeping for backward compatibility)
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

// Workflow execution API functions (ENHANCED)
export const workflowAPI = {
  // Execute a workflow with a query (basic)
  execute: (data) => api.post('/api/workflows/execute', data),
  
  // Execute a workflow with enhanced feedback
  executeEnhanced: (data) => api.post('/api/workflows/execute/enhanced', data),
  
  // Create a new workflow (basic)
  create: (data) => api.post('/api/workflows', data),
  
  // Create a new enhanced workflow with nodes/edges
  createEnhanced: (data) => api.post('/api/workflows/enhanced', data),
  
  // Get all workflows
  getAll: () => api.get('/api/workflows'),
  
  // Get workflow by ID (enhanced with nodes/edges)
  getById: (id) => api.get(`/api/workflows/${id}`),
  
  // Update workflow
  update: (id, data) => api.put(`/api/workflows/${id}`, data),
  
  // Delete workflow
  delete: (id) => api.delete(`/api/workflows/${id}`),
  
  // Validate workflow
  validate: (id) => api.post(`/api/workflows/${id}/validate`),
};

// Chat interface API functions (NEW)
export const chatAPI = {
  // Send chat message through workflow
  query: (data) => api.post('/api/chat/query', data),
};

// Component management API functions (UPDATED - All component types)
export const componentAPI = {
  // Get all components (optionally filtered by type)
  getAll: (type = null) => api.get(`/api/components${type ? `?type=${type}` : ''}`),
  
  // User Query Components
  userQuery: {
    getAll: () => api.get('/api/components/user-query'),
    getById: (id) => api.get(`/api/components/user-query/${id}`),
    create: (data) => api.post('/api/components/user-query', data),
    update: (id, data) => api.put(`/api/components/user-query/${id}`, data),
    delete: (id) => api.delete(`/api/components/user-query/${id}`),
  },
  
  // Knowledge Base Components
  knowledgeBase: {
    getAll: () => api.get('/api/components/knowledge-base'),
    getById: (id) => api.get(`/api/components/knowledge-base/${id}`),
    create: (data) => api.post('/api/components/knowledge-base', data),
    update: (id, data) => api.put(`/api/components/knowledge-base/${id}`, data),
    delete: (id) => api.delete(`/api/components/knowledge-base/${id}`),
  },
  
  // LLM Engine Components
  llmEngine: {
    getAll: () => api.get('/api/components/llm-engine'),
    getById: (id) => api.get(`/api/components/llm-engine/${id}`),
    create: (data) => api.post('/api/components/llm-engine', data),
    update: (id, data) => api.put(`/api/components/llm-engine/${id}`, data),
    delete: (id) => api.delete(`/api/components/llm-engine/${id}`),
  },
  
  // Output Components
  output: {
    getAll: () => api.get('/api/components/output'),
    getById: (id) => api.get(`/api/components/output/${id}`),
    create: (data) => api.post('/api/components/output', data),
    update: (id, data) => api.put(`/api/components/output/${id}`, data),
    delete: (id) => api.delete(`/api/components/output/${id}`),
  },
};

// Component validation API functions (NEW)
export const componentValidationAPI = {
  // Validate component configuration
  validate: (data) => api.post('/api/components/validate', data),
};

// Document management API functions (NEW)
export const documentAPI = {
  // Upload document for Knowledge Base component
  upload: (componentId, formData) => api.post(`/api/documents/upload?component_id=${componentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Get document status
  getStatus: (documentId) => api.get(`/api/documents/${documentId}/status`),
  
  // Get all documents for a component
  getByComponent: (componentId) => api.get(`/api/documents?component_id=${componentId}`),
};

// Legacy alias for backward compatibility
export const userQueryComponentAPI = componentAPI.userQuery;

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
  info: () => api.get('/'),
};

export default api;
