import axios from 'axios';

const API_BASE_URL = process.env.VITE_backend_url;
// const API_BASE_URL = process.env.backend_url || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leadAPI = {
  // Get all leads
  getLeads: () => api.get('/api/leads'),
  
  // Create a new lead
  createLead: (leadData) => api.post('/api/leads', leadData),
  
};

export default api;
