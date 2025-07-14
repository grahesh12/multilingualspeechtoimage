import { APIClient } from '../apiClient';
import { APIResponse, UserStats } from '../types';

const apiClient = new APIClient();

export const getUserStatistics = async (): Promise<UserStats> => {
  try {
    const response = await apiClient.getUserStats();
    console.log('API response:', response);
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch user statistics');
    }
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
}; 