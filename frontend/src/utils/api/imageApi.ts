import { APIClient } from '../apiClient';
import { APIResponse, ImageGenerationResponse, GalleryResponse } from '../types';

const apiClient = new APIClient();

export const sendFormDataToServer = async (formData: {
  prompt: string;
  negativePrompt?: string;
  artStyle: string;
  quality: string;
}): Promise<APIResponse<ImageGenerationResponse>> => {
  try {
    console.log('Sending form data to server:', formData);
    const response = await apiClient.generateImage(formData);
    
    console.log('API response:', response);
    if (response.status === 'success' && response.data) {
      console.log('Image generated successfully:', response.data);
      return response;
    } else {
      throw new Error(response.message || 'Image generation failed');
    }
  } catch (error) {
    
    console.error('Error generating image:', error);
    throw error;
  }
};

export const fetchUserGallery = async (params: {
  page?: number;
  limit?: number;
  art_style?: string;
  quality?: string;
  search?: string;
} = {}): Promise<GalleryResponse> => {
  try {
    const response = await apiClient.getGallery(params);
    console.log('API response:', response);
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch gallery');
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
}; 