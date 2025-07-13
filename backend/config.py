"""
Enhanced configuration management for Voice2Vision backend
"""

import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Images directory
IMAGES_DIR = os.path.join(BASE_DIR, 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)

# Model configurations
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MAX_MODELS_IN_MEMORY = int(os.environ.get('MAX_MODELS_IN_MEMORY', 2))
MODEL_TIMEOUT = int(os.environ.get('MODEL_TIMEOUT', 300))  # 5 minutes

# Model paths for local models
MODEL_PATHS = {
    'realistic_vision': os.path.join(MODELS_DIR, 'realistic_vision_model', 'realistic_vision_model'),
    'dreamshaper': os.path.join(MODELS_DIR, 'dreamshaper_model', 'dreamshaper_model')
}

# Image generation settings
IMAGE_SIZE = int(os.environ.get('IMAGE_SIZE', 1024))
DEFAULT_INFERENCE_STEPS = int(os.environ.get('DEFAULT_INFERENCE_STEPS', 20))
DEFAULT_GUIDANCE_SCALE = float(os.environ.get('DEFAULT_GUIDANCE_SCALE', 7.5))
MAX_IMAGES_TO_KEEP = int(os.environ.get('MAX_IMAGES_TO_KEEP', 1000))

# API settings
MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 25 * 1024 * 1024))  # 25MB
ALLOWED_AUDIO_EXTENSIONS = ('.wav', '.mp3', '.m4a', '.ogg', '.flac')
RATE_LIMIT_REQUESTS = int(os.environ.get('RATE_LIMIT_REQUESTS', 10))
RATE_LIMIT_WINDOW = int(os.environ.get('RATE_LIMIT_WINDOW', 60))

# Security settings
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-key-change-in-production')
JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 7 * 24 * 60 * 60))  # 7 days

# Database settings
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/ai_image_app')
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME', 'ai_image_app')

# Logging configuration
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
LOG_FILE = os.environ.get('LOG_FILE', 'app.log')
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

# Performance settings
GENERATION_TIMEOUT = int(os.environ.get('GENERATION_TIMEOUT', 300))  # 5 minutes
CLEANUP_INTERVAL = int(os.environ.get('CLEANUP_INTERVAL', 3600))  # 1 hour
MEMORY_CHECK_INTERVAL = int(os.environ.get('MEMORY_CHECK_INTERVAL', 300))  # 5 minutes

# User settings
DEFAULT_FREE_CREDITS = int(os.environ.get('DEFAULT_FREE_CREDITS', 25))
DEFAULT_PRO_CREDITS = int(os.environ.get('DEFAULT_PRO_CREDITS', 100))
CREDITS_PER_GENERATION = int(os.environ.get('CREDITS_PER_GENERATION', 5))

# Style detection keywords with enhanced scoring
DREAMSHAPER_KEYWORDS = {
    'anime': 10,
    'cartoon': 8,
    'manga': 10,
    'illustration': 6,
    'artistic': 5,
    'stylized': 4,
    'fantasy': 3,
    'magical': 3,
    'dreamy': 3,
    'ethereal': 3,
    'whimsical': 3,
    'colorful': 2,
    'vibrant': 2,
    'animated': 2,
    'cute': 2,
    'kawaii': 5,
    'chibi': 5,
    'character': 2,
    'portrait': 2,
    'figure': 2
}

REALISTIC_KEYWORDS = {
    'photograph': 10,
    'photo': 8,
    'realistic': 10,
    'real': 8,
    'photorealistic': 10,
    'hyperrealistic': 10,
    'detailed': 5,
    'sharp': 4,
    'clear': 3,
    'professional': 4,
    'high quality': 5,
    'ultra detailed': 6,
    'masterpiece': 3,
    'award winning': 3,
    'cinematic': 4,
    'film': 3,
    'camera': 3,
    'lens': 2,
    'aperture': 2,
    'depth of field': 3,
    'bokeh': 2,
    'natural': 3,
    'organic': 2,
    'texture': 2,
    'material': 2,
    'surface': 2,
    'lighting': 3,
    'shadow': 2,
    'reflection': 2,
    'perspective': 2,
    'composition': 3
}

# Quality presets
QUALITY_PRESETS = {
    'standard': {
        'steps': 20,
        'guidance_scale': 7.5,
        'width': 1024,
        'height': 1024,
        'enhancement': ', good quality, clear'
    },
    'hd': {
        'steps': 30,
        'guidance_scale': 8.0,
        'width': 1792,
        'height': 1024,
        'enhancement': ', high quality, detailed, sharp focus, professional'
    },
    'ultra': {
        'steps': 40,
        'guidance_scale': 8.5,
        'width': 2048,
        'height': 2048,
        'enhancement': ', ultra high quality, extremely detailed, professional photography, masterpiece'
    }
}

# Negative prompt presets
NEGATIVE_PROMPT_PRESETS = {
    'default': 'blurry, low quality, distorted, deformed, ugly, bad anatomy',
    'portrait': 'blurry, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, missing limbs, floating limbs, mutated hands and fingers, out of focus, long neck, long body, mutated hands and fingers, out of focus, long neck, long body, extra limbs, missing limbs, floating limbs, mutated hands and fingers, out of focus, long neck, long body',
    'landscape': 'blurry, low quality, distorted, deformed, ugly, bad composition, oversaturated, overexposed, underexposed, bad lighting',
    'anime': 'blurry, low quality, distorted, deformed, ugly, bad anatomy, extra limbs, missing limbs, floating limbs, mutated hands and fingers, out of focus, long neck, long body, extra limbs, missing limbs, floating limbs, mutated hands and fingers, out of focus, long neck, long body, realistic, photograph'
}

# Model configurations
MODEL_CONFIGS = {
    'realistic_vision': {
        'name': 'SG161222/Realistic_Vision_V5.1_noVAE',
        'description': 'High-quality realistic image generation',
        'best_for': ['portraits', 'landscapes', 'objects', 'realistic scenes'],
        'default_negative_prompt': NEGATIVE_PROMPT_PRESETS['default']
    },
    'dreamshaper': {
        'name': 'Lykon/dreamshaper-8',
        'description': 'Artistic and stylized image generation',
        'best_for': ['anime', 'cartoons', 'illustrations', 'fantasy scenes'],
        'default_negative_prompt': NEGATIVE_PROMPT_PRESETS['anime']
    }
}

# Error messages
ERROR_MESSAGES = {
    'insufficient_credits': 'Insufficient credits. You need {required} credits, but have {current}.',
    'invalid_file_type': 'Invalid file type. Please upload: {allowed_types}',
    'file_too_large': 'File too large. Maximum allowed size is {max_size}MB',
    'generation_failed': 'Image generation failed. Please try again.',
    'model_loading_error': 'Model loading failed. Please try again.',
    'invalid_prompt': 'Prompt is required and cannot be empty.',
    'rate_limit_exceeded': 'Rate limit exceeded. Please wait before making another request.',
    'authentication_failed': 'Authentication failed. Please check your credentials.',
    'user_not_found': 'User not found.',
    'invalid_parameters': 'Invalid parameters provided.'
}

# Success messages
SUCCESS_MESSAGES = {
    'image_generated': 'Image generated successfully',
    'feedback_submitted': 'Feedback submitted successfully',
    'profile_updated': 'Profile updated successfully',
    'password_changed': 'Password changed successfully',
    'login_successful': 'Login successful',
    'signup_successful': 'Account created successfully'
}

# Development settings
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
TESTING = os.environ.get('TESTING', 'False').lower() == 'true'

# CORS settings
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')

# Cache settings
CACHE_ENABLED = os.environ.get('CACHE_ENABLED', 'True').lower() == 'true'
CACHE_TIMEOUT = int(os.environ.get('CACHE_TIMEOUT', 3600))  # 1 hour

# Monitoring settings
ENABLE_MONITORING = os.environ.get('ENABLE_MONITORING', 'True').lower() == 'true'
METRICS_INTERVAL = int(os.environ.get('METRICS_INTERVAL', 60))  # 1 minute

# Backup settings
BACKUP_ENABLED = os.environ.get('BACKUP_ENABLED', 'False').lower() == 'true'
BACKUP_INTERVAL = int(os.environ.get('BACKUP_INTERVAL', 86400))  # 24 hours
BACKUP_RETENTION_DAYS = int(os.environ.get('BACKUP_RETENTION_DAYS', 7))

# Email settings (for future use)
EMAIL_ENABLED = os.environ.get('EMAIL_ENABLED', 'False').lower() == 'true'
SMTP_HOST = os.environ.get('SMTP_HOST', 'localhost')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USERNAME = os.environ.get('SMTP_USERNAME', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')

# Notification settings
NOTIFICATIONS_ENABLED = os.environ.get('NOTIFICATIONS_ENABLED', 'False').lower() == 'true'

# Feature flags
FEATURES = {
    'batch_generation': os.environ.get('FEATURE_BATCH_GENERATION', 'False').lower() == 'true',
    'advanced_settings': os.environ.get('FEATURE_ADVANCED_SETTINGS', 'True').lower() == 'true',
    'style_detection': os.environ.get('FEATURE_STYLE_DETECTION', 'True').lower() == 'true',
    'user_profiles': os.environ.get('FEATURE_USER_PROFILES', 'True').lower() == 'true',
    'gallery_search': os.environ.get('FEATURE_GALLERY_SEARCH', 'True').lower() == 'true',
    'feedback_system': os.environ.get('FEATURE_FEEDBACK_SYSTEM', 'True').lower() == 'true'
}

# Validation rules
VALIDATION_RULES = {
    'username': {
        'min_length': 3,
        'max_length': 20,
        'pattern': r'^[a-zA-Z0-9_]+$'
    },
    'password': {
        'min_length': 6,
        'max_length': 128,
        'require_letter': True,
        'require_number': True
    },
    'prompt': {
        'min_length': 1,
        'max_length': 1000
    },
    'feedback': {
        'min_length': 1,
        'max_length': 1000
    },
    'display_name': {
        'max_length': 50
    },
    'bio': {
        'max_length': 500
    }
}

# API versioning
API_VERSION = 'v1'
API_PREFIX = f'/api/{API_VERSION}'

# Health check settings
HEALTH_CHECK_ENABLED = os.environ.get('HEALTH_CHECK_ENABLED', 'True').lower() == 'true'
HEALTH_CHECK_INTERVAL = int(os.environ.get('HEALTH_CHECK_INTERVAL', 300))  # 5 minutes

# Performance thresholds
PERFORMANCE_THRESHOLDS = {
    'max_generation_time': 300,  # 5 minutes
    'max_memory_usage_mb': 8192,  # 8GB
    'max_gpu_memory_mb': 4096,   # 4GB
    'min_disk_space_gb': 10      # 10GB
}

# Logging configuration
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': LOG_FORMAT
        },
        'detailed': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': LOG_LEVEL,
            'formatter': 'standard',
            'stream': 'ext://sys.stdout'
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': LOG_LEVEL,
            'formatter': 'detailed',
            'filename': LOG_FILE,
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5
        }
    },
    'loggers': {
        '': {
            'handlers': ['console', 'file'],
            'level': LOG_LEVEL,
            'propagate': False
        }
    }
} 