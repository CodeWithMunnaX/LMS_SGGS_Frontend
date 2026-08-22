import api from './api';

export const courseService = {
  async getCourses(params = {}) {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  async getFeaturedCourses() {
    const res = await api.get('/courses/featured');
    return res.data;
  },

  async getCourseById(id) {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  async createCourse(courseData) {
    const res = await api.post('/courses', courseData);
    return res.data;
  },

  async updateCourse(id, courseData) {
    const res = await api.put(`/courses/${id}`, courseData);
    return res.data;
  },

  async deleteCourse(id) {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },

  async getInstructorCourses() {
    const res = await api.get('/courses/instructor/my-courses');
    return res.data;
  },

  async toggleCourseStatus(id) {
    const res = await api.patch(`/courses/${id}/status`);
    return res.data;
  }
};

export default courseService;
