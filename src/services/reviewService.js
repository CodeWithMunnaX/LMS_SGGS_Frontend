import api from './api';

export const reviewService = {
  async getCourseReviews(courseId) {
    const res = await api.get(`/reviews/${courseId}`);
    return res.data;
  },

  async addReview(courseId, reviewData) {
    const res = await api.post(`/reviews/${courseId}`, reviewData);
    return res.data;
  },

  async deleteReview(id) {
    const res = await api.delete(`/reviews/item/${id}`);
    return res.data;
  }
};

export default reviewService;
