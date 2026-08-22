import api from './api';

export const enrollmentService = {
  async enrollInCourse(courseId) {
    const res = await api.post(`/enrollments/${courseId}`);
    return res.data;
  },

  async getMyEnrollments() {
    const res = await api.get('/enrollments/my-learning');
    return res.data;
  },

  async getCourseEnrollment(courseId) {
    const res = await api.get(`/enrollments/course/${courseId}`);
    return res.data;
  },

  async updateLectureProgress(courseId, lectureId, completed = true) {
    const res = await api.patch(`/enrollments/course/${courseId}/progress`, {
      lectureId,
      completed
    });
    return res.data;
  },

  async saveLectureNote(courseId, lectureId, text) {
    const res = await api.post(`/enrollments/course/${courseId}/notes`, {
      lectureId,
      text
    });
    return res.data;
  },

  async getCertificate(certificateId) {
    const res = await api.get(`/enrollments/certificate/${certificateId}`);
    return res.data;
  }
};

export default enrollmentService;
