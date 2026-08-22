import api from './api';

export const mediaService = {
  /**
   * Upload file to Cloudinary with progress tracking
   * @param {File} file 
   * @param {string} folder 
   * @param {Function} onProgress 
   */
  async uploadMedia(file, folder = 'courses', onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const isVideo = file.type.startsWith('video/');
    formData.append('resource_type', isVideo ? 'video' : 'image');

    const res = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });

    return res.data;
  },

  async deleteMedia(publicId, resourceType = 'image') {
    const res = await api.delete('/media/delete', {
      data: { publicId, resourceType }
    });
    return res.data;
  },

  async getCloudinaryStatus() {
    const res = await api.get('/media/status');
    return res.data;
  }
};

export default mediaService;
