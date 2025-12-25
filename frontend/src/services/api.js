import axios from 'axios';

const baseURL = import.meta.env.PROD ? '/api' : 'http://localhost:3030/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;