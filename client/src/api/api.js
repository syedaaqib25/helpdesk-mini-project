import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// Auth
export const login = (formData) => API.post('/api/auth/login', formData);
export const register = (formData) => API.post('/api/auth/register', formData);

// ... rest of the file

// Tickets
// Tickets
export const fetchTickets = (params) => API.get('/api/tickets', { params });
export const fetchTicketById = (id) => API.get(`/api/tickets/${id}`);
export const createTicket = (ticketData) => API.post('/api/tickets', ticketData);
export const updateTicket = (id, ticketData) => API.patch(`/api/tickets/${id}`, ticketData);
export const addComment = (id, commentData) => API.post(`/api/tickets/${id}/comments`, commentData);

export default API;