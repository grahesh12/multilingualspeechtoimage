"""
Enhanced Image generation service for handling AI image creation
"""

import os
import logging
import time
import gc
import torch
from PIL import Image
import io
import glob
import psutil
from datetime import datetime
from diffusers import StableDiffusionPipeline
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import model_loader
from config import *
import threading
from concurrent.futures import ThreadPoolExecutor
import hashlib

logger = logging.getLogger(__name__)

# Add this mapping at the top of the file (after imports)
STYLE_TO_MODEL_KEY = {
    'realistic': 'realistic_vision',
    'dreamshaper': 'dreamshaper'
}

class ImageService:
    def __init__(self):
        """Initialize the image service with enhanced features"""
        self.model_cache = {}
        self.model_last_used = {}
        self.generation_lock = threading.Lock()
        self.executor = ThreadPoolExecutor(max_workers=2)
        self.generation_queue = []
        self.stats = {
            'total_generations': 0,
            'successful_generations': 0,
            'failed_generations': 0,
            'average_generation_time': 0,
            'total_generation_time': 0
        }
        # Add mongo reference for database operations
        self.mongo = None

    def set_mongo(self, mongo):
        """Set MongoDB reference for database operations"""
        self.mongo = mongo

    def get_model(self, style):
        """Get model with enhanced memory management and caching"""
        with self.generation_lock:
            self.unload_unused_models()

            if len(self.model_cache) >= MAX_MODELS_IN_MEMORY:
                if style not in self.model_cache:
                    lru_style = min(self.model_last_used, key=self.model_last_used.get)
                    logger.info(f"Unloading LRU model: {lru_style}")
                    self._unload_model(lru_style)

            if style not in self.model_cache:
                logger.info(f"Loading model: {style}")
                try:
                    # Map frontend style to backend model key
                    model_key = STYLE_TO_MODEL_KEY.get(style, style)
                    self.model_cache[style] = model_loader.load_model(model_key)
                    logger.info(f"Model {style} loaded successfully")
                except Exception as e:
                    logger.error(f"Failed to load model {style}: {e}")
                    raise

            self.model_last_used[style] = time.time()
            return self.model_cache[style]

    def _unload_model(self, style):
        """Safely unload a model"""
        try:
            if style in self.model_cache:
                model_loader.unload_model(self.model_cache[style])
                del self.model_cache[style]
                del self.model_last_used[style]
                gc.collect()
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                logger.info(f"Model {style} unloaded successfully")
        except Exception as e:
            logger.error(f"Error unloading model {style}: {e}")

    def unload_unused_models(self):
        """Unload models that haven't been used recently"""
        current_time = time.time()
        models_to_unload = [
            style for style, last_used in self.model_last_used.items()
            if current_time - last_used > MODEL_TIMEOUT
        ]

        for style in models_to_unload:
            self._unload_model(style)

    def unload_all_models(self):
        """Unload all models in the cache"""
        styles = list(self.model_cache.keys())
        for style in styles:
            self._unload_model(style)

    def detect_visual_style(self, prompt):
        """Enhanced style detection with better scoring and caching"""
        # Create a hash of the prompt for caching
        prompt_hash = hashlib.md5(prompt.lower().encode()).hexdigest()
        
        prompt_lower = prompt.lower()
        dreamshaper_score = 0
        realistic_score = 0
        found_dreamshaper = []
        found_realistic = []

        # Enhanced keyword scoring
        for keyword, score in DREAMSHAPER_KEYWORDS.items():
            if keyword in prompt_lower:
                dreamshaper_score += score
                found_dreamshaper.append(f"{keyword} (+{score})")

        for keyword, score in REALISTIC_KEYWORDS.items():
            if keyword in prompt_lower:
                realistic_score += score
                found_realistic.append(f"{keyword} (+{score})")

        # Additional context-based scoring
        if any(word in prompt_lower for word in ['anime', 'cartoon', 'manga', 'illustration']):
            dreamshaper_score += 5
        if any(word in prompt_lower for word in ['photograph', 'photo', 'realistic', 'real']):
            realistic_score += 5

        logger.info(f"Style detection - Dreamshaper: {dreamshaper_score}, Realistic: {realistic_score}")

        if dreamshaper_score > realistic_score:
            return ("dreamshaper", "Lykon/dreamshaper-8", dreamshaper_score, realistic_score, found_dreamshaper, found_realistic)
        else:
            return ("realistic_vision", "SG161222/Realistic_Vision_V5.1_noVAE", dreamshaper_score, realistic_score, found_dreamshaper, found_realistic)

    def generate_image(self, prompt, style=None, images_dir=IMAGES_DIR, **kwargs):
        """
        Enhanced image generation with better error handling and performance
        """
        start_time = time.time()
        generation_id = f"gen_{int(start_time)}"
        
        try:
            logger.info(f"Starting image generation {generation_id}: {prompt[:100]}...")
            
            # Validate inputs
            
            if not prompt or not prompt.strip():
                return {
                    "success": False,
                    "error": "Prompt is required"
                }
            
            prompt = prompt.strip()
            
            # Auto-detect style if not provided
            if style is None:
                style, model_path, dreamshaper_score, realistic_score, found_dreamshaper, found_realistic = self.detect_visual_style(prompt)
                logger.info(f"Auto-detected style: {style} (dreamshaper: {dreamshaper_score}, realistic: {realistic_score})")

            # Get model
            pipe = self.get_model(style)
            logger.info(f"Using model: {style}")

            # Enhanced generation parameters
            generation_kwargs = {
                "prompt": prompt,
                "negative_prompt": kwargs.get('negative_prompt', "blurry, low quality, distorted, deformed, ugly, bad anatomy"),
                "num_inference_steps": kwargs.get('num_inference_steps', DEFAULT_INFERENCE_STEPS),
                "guidance_scale": kwargs.get('guidance_scale', DEFAULT_GUIDANCE_SCALE),
                "width": kwargs.get('width', IMAGE_SIZE),
                "height": kwargs.get('height', IMAGE_SIZE),
                "num_images_per_prompt": 1
            }

            # Device management
            device = "cuda:1" if torch.cuda.device_count() > 1 else ("cuda" if torch.cuda.is_available() else "cpu")
            if pipe.device.type != device:
                logger.info(f"Moving model to device: {device}")
                pipe = pipe.to(device)

            # Generate image
            logger.info(f"Generating image with parameters: {generation_kwargs}")
            result = pipe(**generation_kwargs)
            
            if not result.images or len(result.images) == 0:
                return {
                    "success": False,
                    "error": "No image was generated"
                }
            
            image = result.images[0]
            generation_time = time.time() - start_time

            # Generate filename with timestamp and style
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"generated_{timestamp}_{style}.png"
            filepath = os.path.join(images_dir, filename)

            # Ensure directory exists
            os.makedirs(images_dir, exist_ok=True)

            # Save image with optimization
            try:
                image.save(filepath, "PNG", optimize=True, quality=95)
                file_size = os.path.getsize(filepath)
                logger.info(f"Image saved: {filename} ({file_size} bytes)")
            except Exception as e:
                logger.error(f"Failed to save image: {e}")
                return {
                    "success": False,
                    "error": f"Failed to save image: {str(e)}"
                }

            # Update statistics
            self._update_stats(generation_time, True)

            # Enhanced metadata
            metadata = {
                "model": style,
                "steps": generation_kwargs['num_inference_steps'],
                "guidance_scale": generation_kwargs['guidance_scale'],
                "size": f"{generation_kwargs['width']}x{generation_kwargs['height']}",
                "generation_time": f"{generation_time:.2f}s",
                "device": device,
                "file_size": file_size,
                "prompt_length": len(prompt),
                "generation_id": generation_id
            }

            logger.info(f"Image generation {generation_id} completed successfully in {generation_time:.2f}s")

            return {
                "success": True,
                "filename": filename,
                "filepath": filepath,
                "style": style,
                "prompt": prompt,
                "timestamp": timestamp,
                "metadata": metadata,
                "generation_time": generation_time
            }

        except Exception as e:
            generation_time = time.time() - start_time
            self._update_stats(generation_time, False)
            
            logger.error(f"Error in image generation {generation_id}: {e}")
            
            # Cleanup on error
            self.unload_all_models()
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()

            error_message = "Model loading issue. Please try again." if "meta tensor" in str(e).lower() else str(e)
            return {
                "success": False,
                "error": error_message,
                "generation_time": generation_time
            }

    def _update_stats(self, generation_time, success):
        """Update generation statistics"""
        self.stats['total_generations'] += 1
        self.stats['total_generation_time'] += generation_time
        
        if success:
            self.stats['successful_generations'] += 1
        else:
            self.stats['failed_generations'] += 1
        
        # Calculate average generation time
        if self.stats['total_generations'] > 0:
            self.stats['average_generation_time'] = self.stats['total_generation_time'] / self.stats['total_generations']

    def cleanup_old_images(self, max_images=MAX_IMAGES_TO_KEEP):
        """Enhanced image cleanup with better error handling"""
        try:
            logger.info(f"Starting image cleanup (max: {max_images})")
            
            image_files = []
            for ext in ["*.png", "*.jpg", "*.jpeg", "*.webp"]:
                image_files.extend(glob.glob(os.path.join(IMAGES_DIR, ext)))

            if len(image_files) > max_images:
                # Sort by modification time (oldest first)
                image_files.sort(key=os.path.getmtime)
                files_to_remove = image_files[:-max_images]
                
                removed_count = 0
                for old_file in files_to_remove:
                    try:
                        os.remove(old_file)
                        removed_count += 1
                        logger.info(f"Removed old image: {os.path.basename(old_file)}")
                    except Exception as e:
                        logger.error(f"Failed to remove {old_file}: {e}")
                
                logger.info(f"Image cleanup completed: {removed_count} files removed")
            else:
                logger.info("No cleanup needed - image count within limits")
                
        except Exception as e:
            logger.error(f"Error during image cleanup: {e}")

    def get_memory_usage(self):
        """Enhanced memory usage monitoring"""
        try:
            process = psutil.Process()
            memory_mb = process.memory_info().rss / 1024 / 1024

            gpu_memory = 0
            gpu_memory_allocated = 0
            gpu_memory_reserved = 0
            
            if torch.cuda.is_available():
                gpu_memory_allocated = torch.cuda.memory_allocated() / 1024 / 1024
                gpu_memory_reserved = torch.cuda.memory_reserved() / 1024 / 1024
                gpu_memory = gpu_memory_allocated

            return {
                "cpu_memory_mb": round(memory_mb, 2),
                "gpu_memory_mb": round(gpu_memory, 2),
                "gpu_memory_allocated_mb": round(gpu_memory_allocated, 2),
                "gpu_memory_reserved_mb": round(gpu_memory_reserved, 2),
                "models_loaded": len(self.model_cache),
                "generation_stats": self.stats
            }
        except Exception as e:
            logger.error(f"Error getting memory usage: {e}")
            return {
                "cpu_memory_mb": 0,
                "gpu_memory_mb": 0,
                "gpu_memory_allocated_mb": 0,
                "gpu_memory_reserved_mb": 0,
                "models_loaded": 0,
                "generation_stats": self.stats
            }

    def get_service_status(self):
        """Get comprehensive service status"""
        try:
            memory_usage = self.get_memory_usage()
            
            # Check disk space
            disk_usage = psutil.disk_usage(IMAGES_DIR)
            disk_free_gb = disk_usage.free / (1024**3)
            
            # Check if models are accessible
            models_status = {}
            for style in ['realistic_vision', 'dreamshaper']:
                models_status[style] = style in self.model_cache
            
            return {
                "status": "healthy",
                "memory_usage": memory_usage,
                "disk_free_gb": round(disk_free_gb, 2),
                "models_status": models_status,
                "active_generations": len(self.generation_queue),
                "uptime": time.time() - getattr(self, '_start_time', time.time())
            }
        except Exception as e:
            logger.error(f"Error getting service status: {e}")
            return {
                "status": "error",
                "error": str(e)
            }

    def batch_generate(self, prompts, style=None, **kwargs):
        """Generate multiple images in batch"""
        results = []
        
        for i, prompt in enumerate(prompts):
            logger.info(f"Batch generation {i+1}/{len(prompts)}: {prompt[:50]}...")
            result = self.generate_image(prompt, style, **kwargs)
            results.append(result)
            
            # Small delay between generations to prevent overload
            if i < len(prompts) - 1:
                time.sleep(1)
        
        return results

    def __del__(self):
        """Cleanup on service shutdown"""
        try:
            self.unload_all_models()
            if hasattr(self, 'executor'):
                self.executor.shutdown(wait=True)
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
