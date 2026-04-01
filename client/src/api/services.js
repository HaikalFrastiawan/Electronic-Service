import api from './axios'

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const bookingsAPI = {
  getAll: () => api.get('/admin/bookings'),
  getById: (id) => api.get(`/admin/bookings/${id}`),
  create: (data) => api.post('/admin/bookings', data),
  createPublic: (data) => api.post('/public/bookings', data), // Public is correct as is
  update: (id, data) => api.put(`/admin/bookings/${id}`, data),
  updateStatus: (id, status, technicianId = null) => api.patch(`/admin/bookings/${id}/status`, { 
    status, 
    technician_id: technicianId 
  }),
  delete: (id) => api.delete(`/admin/bookings/${id}`),
  addItem: (bookingId, data) => api.post(`/admin/bookings/${bookingId}/items`, data),
  getCustomerBookings: () => api.get('/customer/bookings'),
  createCustomerBooking: (data) => api.post('/customer/bookings', data),
}

export const customersAPI = {
  getAll: () => api.get('/admin/customers'),
  getById: (id) => api.get(`/admin/customers/${id}`),
  create: (data) => api.post('/admin/customers', data),
  update: (id, data) => api.put(`/admin/customers/${id}`, data),
  delete: (id) => api.delete(`/admin/customers/${id}`),
}

export const techniciansAPI = {
  getAll: () => api.get('/admin/technicians'),
  getById: (id) => api.get(`/admin/technicians/${id}`),
  create: (data) => api.post('/admin/technicians', data),
  update: (id, data) => api.put(`/admin/technicians/${id}`, data),
  delete: (id) => api.delete(`/admin/technicians/${id}`),
}

export const sparepartsAPI = {
  getAll: () => api.get('/admin/spareparts'),
  getById: (id) => api.get(`/admin/spareparts/${id}`),
  create: (data) => api.post('/admin/spareparts', data),
  update: (id, data) => api.put(`/admin/spareparts/${id}`, data),
  delete: (id) => api.delete(`/admin/spareparts/${id}`),
}

export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard-stats'),
}

