import api from './api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    path: string;
    name: string;
    size: number;
    mime_type: string;
  };
}

export const uploadService = {
  async uploadImage(
    file: File,
    folder: string = 'general',
    onProgress?: (percent: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await api.post<UploadResponse>('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return response.data.data.url;
  },
};

export default uploadService;
