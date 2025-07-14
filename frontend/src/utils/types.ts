// API Response types
export interface APIResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: string;
}

export interface ImageGenerationResponse {
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

export interface GalleryResponse {
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

export interface UserStats {
  total_images: number;
  total_feedback: number;
  credits: number;
  plan: string;
  recent_activity: Array<{
    created_at: string;
    art_style: string;
  }>;
}

export interface SystemStatus {
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