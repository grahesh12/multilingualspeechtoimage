import { APIClient } from '../apiClient';
import { SystemStatus } from '../types';

const apiClient = new APIClient();

export const getSystemStatus = async (): Promise<SystemStatus> => {
  try {
    const response = await apiClient.getSystemStatus();
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
};

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.healthCheck();
    console.log('API response:', response);
    return true;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}; 