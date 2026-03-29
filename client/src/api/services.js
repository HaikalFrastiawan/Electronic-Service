import api from './axios'

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  createPublic: (data) => api.post('/public/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
  addItem: (bookingId, data) => api.post(`/bookings/${bookingId}/items`, data),
}

export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
}

export const techniciansAPI = {
  getAll: () => api.get('/technicians'),
  getById: (id) => api.get(`/technicians/${id}`),
  create: (data) => api.post('/technicians', data),
  update: (id, data) => api.put(`/technicians/${id}`, data),
  delete: (id) => api.delete(`/technicians/${id}`),
}

export const sparepartsAPI = {
  getAll: () => api.get('/spareparts'),
  getById: (id) => api.get(`/spareparts/${id}`),
  create: (data) => api.post('/spareparts', data),
  update: (id, data) => api.put(`/spareparts/${id}`, data),
  delete: (id) => api.delete(`/spareparts/${id}`),
}

export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard-stats'),
}

