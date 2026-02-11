const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

const API_URL = isDevelopment 
  ? 'http://localhost:8080' 
  : (import.meta.env.VITE_API_URL || 'https://nexuschat-ojn0.onrender.com');

console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🔗 API URL:', API_URL);

export default API_URL;