import { APIClient } from '../apiClient';
import { APIResponse } from '../types';

const apiClient = new APIClient();

export const processVoiceInput = async (audioFile: File): Promise<{
  filename: string;
  file_size: number;
  transcription: string;
  translation: string;
  language: string;
  processing_time: number;
}> => {
  try {
    const response = await apiClient.processVoice(audioFile);
    console.log('API response:', response);
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Voice processing failed');
    }
  } catch (error) {
    console.error('Error processing voice:', error);
    throw error;
  }
};

export const sendVoiceFileToServer = async (audioFile: File): Promise<{
  transcription: string;
  translation: string;
  language: string;
  error?: string;
}> => {
  try {
    const response = await apiClient.processVoice(audioFile);
    console.log('API response:', response);
    if (response.status === 'success' && response.data) {
      return {
        transcription: response.data.transcription || '',
        translation: response.data.translation || '',
        language: response.data.language || 'unknown'
      };
    } else {
      return {
        transcription: '',
        translation: '',
        language: 'unknown',
        error: response.message || 'Voice processing failed'
      };
    }
  } catch (error) {
    console.error('Error processing voice file:', error);
    return {
      transcription: '',
      translation: '',
      language: 'unknown',
      error: error instanceof Error ? error.message : 'Voice processing failed'
    };
  }
}; 