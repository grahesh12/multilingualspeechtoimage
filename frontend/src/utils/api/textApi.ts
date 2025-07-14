import { APIClient } from '../apiClient';
import { APIResponse } from '../types';

const apiClient = new APIClient();

export const processTextInput = async (text: string): Promise<{
  original_text: string;
  translation: string;
  source_language: string;
  target_language: string;
}> => {
  try {
    const response = await apiClient.processText(text);
    console.log('API response:', response);
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Text processing failed');
    }
  } catch (error) {
    console.error('Error processing text:', error);
    throw error;
  }
};

export const sendTextToServer = async (text: string): Promise<{
  translation: string;
  original_text: string;
  source_language: string;
  target_language: string;
  error?: string;
}> => {
  try {
    const response = await apiClient.processText(text);
    if (response.status === 'success' && response.data) {
      return {
        translation: response.data.translation || '',
        original_text: response.data.original_text || '',
        source_language: response.data.source_language || 'unknown',
        target_language: response.data.target_language || 'en'
      };
    } else {
      return {
        translation: '',
        original_text: text,
        source_language: 'unknown',
        target_language: 'en',
        error: response.message || 'Text processing failed'
      };
    }
  } catch (error) {
    console.error('Error processing text:', error);
    return {
      translation: '',
      original_text: text,
      source_language: 'unknown',
      target_language: 'en',
      error: error instanceof Error ? error.message : 'Text processing failed'
    };
  }
}; 