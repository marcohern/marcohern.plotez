import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

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
