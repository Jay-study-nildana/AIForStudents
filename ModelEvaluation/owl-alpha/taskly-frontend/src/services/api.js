import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Request interceptor: attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API functions
export async function login(credentials) {
  const res = await api.post('/api/auth/login', credentials);
  return res.data;
}

export async function register(userData) {
  const res = await api.post('/api/auth/register', userData);
  return res.data;
}

// Category API functions
export async function getCategories() {
  const res = await api.get('/api/categories');
  return res.data;
}

export async function getCategoryById(id) {
  const res = await api.get(`/api/categories/${id}`);
  return res.data;
}

export async function createCategory(data) {
  const res = await api.post('/api/categories', data);
  return res.data;
}

export async function updateCategory(id, data) {
  const res = await api.put(`/api/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
}

// Task API functions
export async function getTasks(params = {}) {
  const res = await api.get('/api/tasks', { params });
  return res.data;
}

export async function getTaskById(id) {
  const res = await api.get(`/api/tasks/${id}`);
  return res.data;
}

export async function createTask(data) {
  const res = await api.post('/api/tasks', data);
  return res.data;
}

export async function updateTask(id, data) {
  const res = await api.put(`/api/tasks/${id}`, data);
  return res.data;
}

export async function deleteTask(id) {
  const res = await api.delete(`/api/tasks/${id}`);
  return res.data;
}

// User API functions (admin only)
export async function getUsers() {
  const res = await api.get('/api/users');
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
}
