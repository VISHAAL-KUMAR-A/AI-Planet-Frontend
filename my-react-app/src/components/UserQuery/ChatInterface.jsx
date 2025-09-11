import { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Clock, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import { formatDateTime, getStatusBadgeColor } from '../../utils/formatters';
import { useWorkflows } from '../../hooks/useWorkflows';

const ChatInterface = ({ workflow, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const { executeWorkflow, loading } = useWorkflows();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      // Execute through workflow (uses /api/workflows/execute)
      if (!workflow || !workflow.id) {
        throw new Error('No workflow provided for execution');
      }
      
      const result = await executeWorkflow(workflow.id, message);

      const botResponse = {
        id: result.execution_id || result.id || Date.now(),
        type: 'bot',
        content: result.result?.response || result.response || result.result?.message || 'Query processed successfully',
        timestamp: result.executed_at || result.processed_at || new Date().toISOString(),
        status: result.status,
        queryData: result,
        executionSteps: result.execution_steps || null,
      };

      setChatHistory(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: error.message || 'Sorry, there was an error processing your query. Please try again.',
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: true,
      };

      setChatHistory(prev => [...prev, errorResponse]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Chat with {workflow?.name || 'AI Assistant'}
              </h2>
              <p className="text-sm text-gray-500">
                Ask questions to test your workflow
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {chatHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Start a conversation by asking a question</p>
                <p className="text-sm text-gray-400 mt-1">Your query will be processed by the AI workflow</p>
              </motion.div>
            ) : (
              chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md xl:max-w-lg ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.type === 'user' 
                        ? 'bg-primary-600' 
                        : msg.error 
                          ? 'bg-red-100' 
                          : 'bg-gray-100'
                    }`}>
                      {msg.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : msg.error ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : msg.error
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      
                      {/* Bot message metadata */}
                      {msg.type === 'bot' && msg.queryData && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(msg.status)}`}>
                              {msg.status}
                            </span>
                          </div>
                          {(msg.queryData.processed_at || msg.queryData.executed_at) && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Processed:</span>
                              <span className="text-gray-600">
                                {formatDateTime(msg.queryData.processed_at || msg.queryData.executed_at)}
                              </span>
                            </div>
                          )}
                          {msg.executionSteps && msg.executionSteps.length > 0 && (
                            <div className="text-xs">
                              <span className="text-gray-500">Components executed:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {msg.executionSteps.map((step, index) => (
                                  <span 
                                    key={index}
                                    className={`px-2 py-1 rounded text-xs ${
                                      step.success 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}
                                  >
                                    {step.component_type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className={`mt-2 text-xs ${msg.type === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                        {formatDateTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          
          {/* Loading indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-500">Processing your query...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  workflow?.description || 
                  'Type your question here...'
                }
                maxLength={1000}
                rows={1}
                className="textarea-field resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </span>
                <span className="text-xs text-gray-500">
                  {message.length}/1000
                </span>
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!message.trim() || loading}
              className="btn-primary h-11 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatInterface;
