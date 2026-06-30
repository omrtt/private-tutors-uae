import axios from 'axios';

// Create an axios instance with a configurable base URL
// In production (Netlify): set VITE_API_URL to your backend URL
// In development: uses Vite proxy (localhost:5000) when VITE_API_URL is not set
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
