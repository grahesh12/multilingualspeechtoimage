import { APIResponse } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export class APIClient {
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
        // BEGIN detailed error logging
        console.error('API Error:', error);
        if (error instanceof APIError) {
          console.error('APIError details:', {
            message: error.message,
            status: error.status,
            code: error.code,
          });
        } else if (error instanceof Response) {
          error.text().then(text => {
            console.error('API Error Response:', {
              status: error.status,
              statusText: error.statusText,
              headers: [...error.headers.entries()],
              body: text,
            });
          });
        }
        // END detailed error logging
        lastError = error as Error;
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          throw error;
        }
        if (attempt === retries) {
          throw error;
        }
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError || new Error('Request failed');
  }

  async healthCheck(): Promise<any> {
    return this.request<any>('/health');
  }

  async processText(text: string): Promise<APIResponse> {
    return this.request<APIResponse>('/text', {
      method: 'POST',
      body: { text }
    });
  }

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
      signal: AbortSignal.timeout(60000)
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

  async generateImage(formData: {
    prompt: string;
    negativePrompt?: string;
    artStyle: string;
    quality: string;
  }): Promise<APIResponse> {
    return this.request<APIResponse>('/generate', {
      method: 'POST',
      body: formData,
      timeout: 300000
    });
  }

  async getGallery(params: {
    page?: number;
    limit?: number;
    art_style?: string;
    quality?: string;
    search?: string;
  } = {}): Promise<APIResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const endpoint = `/gallery${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request<APIResponse>(endpoint);
  }

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

  async getUserStats(): Promise<APIResponse> {
    return this.request<APIResponse>('/stats');
  }

  async getSystemStatus(): Promise<any> {
    return this.request<any>('/system/status');
  }
} 