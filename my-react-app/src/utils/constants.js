// Component types
export const COMPONENT_TYPES = {
  USER_QUERY: 'user_query',
  KNOWLEDGE_BASE: 'knowledge_base',
  LLM_ENGINE: 'llm_engine',
  OUTPUT: 'output',
};

// Query statuses
export const QUERY_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

// Default component configurations
export const DEFAULT_USER_QUERY_CONFIG = {
  name: 'New User Query Component',
  description: 'Component for handling user queries',
  placeholder_text: 'Enter your question here...',
  max_length: 500,
  component_type: COMPONENT_TYPES.USER_QUERY,
};

// Animation constants
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// UI Constants
export const UI_CONSTANTS = {
  MAX_COMPONENT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_QUERY_LENGTH: 2000,
  DEBOUNCE_DELAY: 300,
};

// Predefined Workflows (from backend)
export const PREDEFINED_WORKFLOWS = {
  SIMPLE_QA: {
    id: '14e209b1-d48e-4f8e-9512-a212914b8474',
    name: 'Simple Q&A Workflow',
    description: 'Basic question answering with LLM',
    type: 'qa',
  },
  FULL_RAG: {
    id: '74939cac-9283-4744-845f-2f3321cdef09',
    name: 'Full RAG Workflow',
    description: 'Advanced retrieval-augmented generation with knowledge base',
    type: 'rag',
  },
};

// Workflow types
export const WORKFLOW_TYPES = {
  QA: 'qa',
  RAG: 'rag',
  CUSTOM: 'custom',
};