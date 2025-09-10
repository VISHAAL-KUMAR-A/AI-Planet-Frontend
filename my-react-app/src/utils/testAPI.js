// Test utility to verify backend API connectivity
import { healthAPI, userQueryComponentAPI } from '../services/api';

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await healthAPI.check();
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test API info
    const infoResponse = await healthAPI.info();
    console.log('✅ API info:', infoResponse.data);
    
    // Test getting components
    const componentsResponse = await userQueryComponentAPI.getAll();
    console.log('✅ Components retrieved:', componentsResponse.data.length, 'components');
    
    console.log('🎉 All tests passed! Backend is connected and working.');
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('📡 Make sure your backend server is running on http://0.0.0.0:8000');
    }
    return false;
  }
};

// You can call this function from the browser console to test connectivity
window.testBackendConnection = testBackendConnection;
