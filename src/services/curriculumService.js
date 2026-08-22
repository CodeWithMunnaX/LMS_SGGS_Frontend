import api from './api';

export const curriculumService = {
  async addSection(courseId, sectionData) {
    const res = await api.post(`/courses/${courseId}/sections`, sectionData);
    return res.data;
  },

  async updateSection(courseId, sectionId, sectionData) {
    const res = await api.put(`/courses/${courseId}/sections/${sectionId}`, sectionData);
    return res.data;
  },

  async deleteSection(courseId, sectionId) {
    const res = await api.delete(`/courses/${courseId}/sections/${sectionId}`);
    return res.data;
  },

  async addLecture(courseId, sectionId, lectureData) {
    const res = await api.post(`/courses/${courseId}/sections/${sectionId}/lectures`, lectureData);
    return res.data;
  },

  async updateLecture(courseId, sectionId, lectureId, lectureData) {
    const res = await api.put(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`, lectureData);
    return res.data;
  },

  async deleteLecture(courseId, sectionId, lectureId) {
    const res = await api.delete(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`);
    return res.data;
  }
};

export default curriculumService;
