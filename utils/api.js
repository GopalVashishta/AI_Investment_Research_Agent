import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // All requests will go to /api/endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;