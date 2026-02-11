const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.MODE === 'production' 
                  ? 'https://nexuschat-ojn0.onrender.com' 
                  : 'http://localhost:8080');

export default API_URL;