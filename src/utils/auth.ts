import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const authAPI = {
  register: (email: string, password: string) =>
    axios.post(`${API_BASE_URL}/api/register`, { email, password }),
  
  login: (email: string, password: string) =>
    axios.post(`${API_BASE_URL}/api/login`, { email, password }),
  
  summarize: (youtubeUrl: string, token: string) =>
    axios.post(`${API_BASE_URL}/api/summarize`, { youtubeUrl }, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  getSummaries: (token: string) =>
    axios.get(`${API_BASE_URL}/api/summaries`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};
