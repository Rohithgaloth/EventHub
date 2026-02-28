import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('eventhub_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('eventhub_token');
            localStorage.removeItem('eventhub_user');
            // Don't redirect if already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ── Auth API ──
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/me', data),
};

// ── Events API ──
export const eventsAPI = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    getMine: () => api.get('/events/my'),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
};

// ── Registrations API ──
export const registrationsAPI = {
    register: (data) => api.post('/registrations', data),
    getMine: () => api.get('/registrations/my'),
    getByEvent: (eventId) => api.get(`/registrations/event/${eventId}`),
    checkIn: (id) => api.put(`/registrations/${id}/checkin`),
};

// ── Payments API ──
export const paymentsAPI = {
    createIntent: (data) => api.post('/payments/create-intent', data),
    getStatus: (registrationId) => api.get(`/payments/status/${registrationId}`),
};

// ── Upload API ──
export const uploadAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    uploadMultiple: (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// ── Dashboard API ──
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getRecentEvents: () => api.get('/dashboard/recent-events'),
    getRevenueChart: () => api.get('/dashboard/revenue-chart'),
};

export default api;
