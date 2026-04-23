import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('api_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('api_token');
            localStorage.removeItem('api_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export const categories = {
    list: () => api.get('/categories').then(r => r.data),
    get: id => api.get(`/categories/${id}`).then(r => r.data),
    create: data => api.post('/categories', data).then(r => r.data),
    update: (id, data) => api.put(`/categories/${id}`, data).then(r => r.data),
    delete: id => api.delete(`/categories/${id}`),
};

export const plots = {
    list: () => api.get('/plots').then(r => r.data),
    get: id => api.get(`/plots/${id}`).then(r => r.data),
    create: data => api.post('/plots', data).then(r => r.data),
    update: (id, data) => api.put(`/plots/${id}`, data).then(r => r.data),
    delete: id => api.delete(`/plots/${id}`),
};
