/**
 * Enhanced API client for Voice2Vision backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Enhanced error handling
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Request configuration
interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

// API Response types
interface APIResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: string;
}

interface ImageGenerationResponse {
  filename: string;
  filepath: string;
  style: string;
  prompt: string;
  negative_prompt: string;
  art_style: string;
  quality: string;
  metadata: any;
  credits: number;
  generation_time: string;
}

interface GalleryResponse {
  images: Array<{
    id: string;
    filename: string;
    url: string;
    prompt: string;
    negative_prompt: string;
    art_style: string;
    quality: string;
    style: string;
    created_at: string;
    generation_time?: number;
    file_size?: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
    total_pages: number;
  };
  filters?: {
    art_style?: string;
    quality?: string;
    search?: string;
  };
}

interface UserStats {
  total_images: number;
  total_feedback: number;
  credits: number;
  plan: string;
  recent_activity: Array<{
    created_at: string;
    art_style: string;
  }>;
}

interface SystemStatus {
  status: string;
  timestamp: string;
  memory_usage: {
    cpu_memory_mb: number;
    gpu_memory_mb: number;
    gpu_memory_allocated_mb: number;
    gpu_memory_reserved_mb: number;
    models_loaded: number;
    generation_stats: {
      total_generations: number;
      successful_generations: number;
      failed_generations: number;
      average_generation_time: number;
    };
  };
  database_stats: {
    users: number;
    images: number;
    feedback: number;
  };
}

// Enhanced HTTP client with retry logic
class APIClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = 30000, retries: number = 3) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultRetries = retries;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout)
    };

    if (body) {
      requestConfig.body = JSON.stringify(body);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestConfig);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            errorData.error || errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData.code
          );
        }

        const data = await response.json();
        return data as T;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Request failed');
  }

  // Health check
  async healthCheck(): Promise<SystemStatus> {
    return this.request<SystemStatus>('/health');
  }

  // Text processing
  async processText(text: string): Promise<APIResponse> {
    return this.request<APIResponse>('/text', {
      method: 'POST',
      body: { text }
    });
  }

  // Voice processing
  async processVoice(audioFile: File): Promise<APIResponse> {
    const formData = new FormData();
    formData.append('voice', audioFile);

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/voice`, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(60000) // 60 seconds for voice processing
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.error || errorData.message || `HTTP ${response.status}`,
        response.status
      );
    }

    return response.json();
  }

  // Image generation
  async generateImage(formData: {
    prompt: string;
    negativePrompt?: string;
    artStyle: string;
    quality: string;
  }): Promise<APIResponse<ImageGenerationResponse>> {
    return this.request<APIResponse<ImageGenerationResponse>>('/generate', {
      method: 'POST',
      body: formData,
      timeout: 300000 // 5 minutes for image generation
    });
  }

  // Gallery
  async getGallery(params: {
    page?: number;
    limit?: number;
    art_style?: string;
    quality?: string;
    search?: string;
  } = {}): Promise<APIResponse<GalleryResponse>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/gallery${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<APIResponse<GalleryResponse>>(endpoint);
  }

  // Feedback
  async submitFeedback(feedback: {
    rating: number;
    feedback: string;
    category?: string;
  }): Promise<APIResponse> {
    return this.request<APIResponse>('/feedback', {
      method: 'POST',
      body: feedback
    });
  }

  // User statistics
  async getUserStats(): Promise<APIResponse<UserStats>> {
    return this.request<APIResponse<UserStats>>('/stats');
  }

  // System status
  async getSystemStatus(): Promise<SystemStatus> {
    return this.request<SystemStatus>('/system/status');
  }
}

// Create API client instance
const apiClient = new APIClient();

// Enhanced form data submission with better error handling
export const sendFormDataToServer = async (formData: {
  prompt: string;
  negativePrompt?: string;
  artStyle: string;
  quality: string;
}): Promise<APIResponse<ImageGenerationResponse>> => {
  try {
    console.log('Sending form data to server:', formData);
    
    const response = await apiClient.generateImage(formData);
    
    if (response.status === 'success' && response.data) {
      console.log('Image generated successfully:', response.data);
      return response;
    } else {
      throw new APIError(
        response.message || 'Image generation failed',
        500
      );
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );
  }
};

// Enhanced gallery fetching
export const fetchUserGallery = async (params: {
  page?: number;
  limit?: number;
  art_style?: string;
  quality?: string;
  search?: string;
} = {}): Promise<GalleryResponse> => {
  try {
    const response = await apiClient.getGallery(params);
    
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new APIError(
        response.message || 'Failed to fetch gallery',
        500
      );
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
};

// Enhanced feedback submission
export const submitUserFeedback = async (feedback: {
  rating: number;
  feedback: string;
  category?: string;
}): Promise<void> => {
  try {
    const response = await apiClient.submitFeedback(feedback);
    
    if (response.status !== 'success') {
      throw new APIError(
        response.message || 'Failed to submit feedback',
        500
      );
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Feedback submission function (for backward compatibility)
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

// Health check utility
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    await apiClient.healthCheck();
    return true;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Get user statistics
export const getUserStatistics = async (): Promise<UserStats> => {
  try {
    const response = await apiClient.getUserStats();
    
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new APIError(
        response.message || 'Failed to fetch user statistics',
        500
      );
    }
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

// Get system status
export const getSystemStatus = async (): Promise<SystemStatus> => {
  try {
    return await apiClient.getSystemStatus();
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
};

// Enhanced text processing
export const processTextInput = async (text: string): Promise<{
  original_text: string;
  translation: string;
  source_language: string;
  target_language: string;
}> => {
  try {
    const response = await apiClient.processText(text);
    
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new APIError(
        response.message || 'Text processing failed',
        500
      );
    }
  } catch (error) {
    console.error('Error processing text:', error);
    throw error;
  }
};

// Text processing function (for backward compatibility)
export const sendTextToServer = async (text: string): Promise<{
  translation: string;
  original_text: string;
  source_language: string;
  target_language: string;
  error?: string;
}> => {
  try {
    const response = await apiClient.processText(text);
    
    if (response.status === 'success' && response) {
      

      return {
        translation: response.translation || '',
        original_text: response.original_text || '',
        source_language: response.source_language || 'unknown',
        target_language: response.target_language || 'en'
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

// Enhanced voice processing
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
    
    if (response.status === 'success' && response.data) {
      return response.data;
    } else {
      throw new APIError(
        response.message || 'Voice processing failed',
        500
      );
    }
  } catch (error) {
    console.error('Error processing voice:', error);
    throw error;
  }
};

// Voice file upload function (for backward compatibility)
export const sendVoiceFileToServer = async (audioFile: File): Promise<{
  transcription: string;
  translation: string;
  language: string;
  error?: string;
}> => {
  try {
    const response = await apiClient.processVoice(audioFile);
    
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

// Utility function to handle API errors in components
export const handleAPIError = (error: unknown): string => {
  if (error instanceof APIError) {
    // Handle specific error codes
    switch (error.code) {
      case 'token_expired':
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authStateChanged'));
        return 'Your session has expired. Please log in again.';
      case 'insufficient_credits':
        return 'Insufficient credits. Please upgrade your plan or wait for credit refresh.';
      case 'rate_limit_exceeded':
        return 'Too many requests. Please wait a moment before trying again.';
      default:
        return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Export the API client for direct use if needed
export { apiClient, APIError }; 
