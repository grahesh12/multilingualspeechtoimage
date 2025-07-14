import { APIClient } from '../apiClient';
import { APIResponse } from '../types';

const apiClient = new APIClient();

export const submitUserFeedback = async (feedback: {
  rating: number;
  feedback: string;
  category?: string;
}): Promise<void> => {
  try {
    const response = await apiClient.submitFeedback(feedback);
    console.log('API response:', response);
    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to submit feedback');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const sendFeedbackToServer = async (feedback: {
  rating: number;
  feedback: string;
  category?: string;
}): Promise<{
  status: 'success' | 'error';
  message?: string;
  error?: string;
}> => {
  try {
    const response = await apiClient.submitFeedback(feedback);
    console.log('API response:', response);
    if (response.status === 'success') {
      return {
        status: 'success',
        message: response.message || 'Feedback submitted successfully'
      };
    } else {
      return {
        status: 'error',
        error: response.message || 'Failed to submit feedback'
      };
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Failed to submit feedback'
    };
  }
}; 