import api from './api';

export const adminService = {
  async getPlatformStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getAllUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserRole(id, role) {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  async toggleUserStatus(id) {
    const res = await api.patch(`/admin/users/${id}/status`);
    return res.data;
  },

  async getAllCoursesAdmin(params = {}) {
    const res = await api.get('/admin/courses', { params });
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/admin/categories');
    return res.data;
  },

  async createCategory(categoryData) {
    const res = await api.post('/admin/categories', categoryData);
    return res.data;
  },

  async deleteCategory(id) {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  }
};

export default adminService;
