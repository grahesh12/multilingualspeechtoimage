"""
Image generation service for handling AI image creation
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
import model_loader
from config import *

logger = logging.getLogger(__name__)

class ImageService:
    def __init__(self):
        """Initialize the image service"""
        self.model_cache = {}
        self.model_last_used = {}
        self.generation_lock = False

    def get_model(self, style):
        """Get model with enhanced memory management"""
        self.unload_unused_models()

        if len(self.model_cache) >= MAX_MODELS_IN_MEMORY:
            if style not in self.model_cache:
                lru_style = min(self.model_last_used, key=self.model_last_used.get)
                logger.info(f"Unloading LRU model: {lru_style}")
                del self.model_cache[lru_style]
                del self.model_last_used[lru_style]
                gc.collect()
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()

        if style not in self.model_cache:
            logger.info(f"Loading model: {style}")
            self.model_cache[style] = model_loader.load_model(style)

        self.model_last_used[style] = time.time()
        return self.model_cache[style]

    def unload_unused_models(self):
        """Unload models that haven't been used recently"""
        current_time = time.time()
        models_to_unload = [style for style, last_used in self.model_last_used.items()
                            if current_time - last_used > MODEL_TIMEOUT]

        for style in models_to_unload:
            if style in self.model_cache:
                logger.info(f"Unloading unused model: {style}")
                model_loader.unload_model(self.model_cache[style])
                del self.model_cache[style]
                del self.model_last_used[style]

    def unload_all_models(self):
        """Unload all models in the cache"""
        styles = list(self.model_cache.keys())
        for style in styles:
            logger.info(f"Unloading model: {style}")
            model_loader.unload_model(self.model_cache[style])
            del self.model_cache[style]
            self.model_last_used.pop(style, None)

    def detect_visual_style(self, prompt):
        """Enhanced style detection with better scoring"""
        prompt_lower = prompt.lower()
        dreamshaper_score = 0
        realistic_score = 0
        found_dreamshaper = []
        found_realistic = []

        for keyword, score in DREAMSHAPER_KEYWORDS.items():
            if keyword in prompt_lower:
                dreamshaper_score += score
                found_dreamshaper.append(f"{keyword} (+{score})")

        for keyword, score in REALISTIC_KEYWORDS.items():
            if keyword in prompt_lower:
                realistic_score += score
                found_realistic.append(f"{keyword} (+{score})")

        if dreamshaper_score > realistic_score:
            return ("dreamshaper", "Lykon/dreamshaper-8", dreamshaper_score, realistic_score, found_dreamshaper, found_realistic)
        else:
            return ("realistic_vision", "SG161222/Realistic_Vision_V5.1_noVAE", dreamshaper_score, realistic_score, found_dreamshaper, found_realistic)

    def generate_image(self, prompt, style=None, images_dir=IMAGES_DIR):
        """
        Generate image from prompt
        """
        try:
            if self.generation_lock:
                return {
                    "success": False,
                    "error": "Generation already in progress"
                }

            self.generation_lock = True

            if style is None:
                style, model_path, dreamshaper_score, realistic_score, found_dreamshaper, found_realistic = self.detect_visual_style(prompt)
                logger.info(f"Auto-detected style: {style} (dreamshaper: {dreamshaper_score}, realistic: {realistic_score})")

            pipe = self.get_model(style)
            logger.info(f"Generating image with prompt: {prompt[:100]}...")

            start_time = time.time()

            generation_kwargs = {
                "prompt": prompt,
                "negative_prompt": "blurry, low quality, distorted, deformed",
                "num_inference_steps": DEFAULT_INFERENCE_STEPS,
                "guidance_scale": DEFAULT_GUIDANCE_SCALE,
                "width": IMAGE_SIZE,
                "height": IMAGE_SIZE
            }

            # device = "cuda" if torch.cuda.is_available() else "cpu"
            device = "cuda:1" if torch.cuda.device_count() > 1 else ("cuda" if torch.cuda.is_available() else "cpu")
            if pipe.device.type != device:
                pipe = pipe.to(device)

            result = pipe(**generation_kwargs)
            generation_time = time.time() - start_time
            image = result.images[0]

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"generated_{timestamp}_{style}.png"
            filepath = os.path.join(images_dir, filename)

            os.makedirs(images_dir, exist_ok=True)
            image.save(filepath, "PNG", optimize=True)

            logger.info(f"Image generated successfully: {filename}")

            # Cleanup immediately after generation
            self.unload_all_models()
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()

            return {
                "success": True,
                "filename": filename,
                "filepath": filepath,
                "style": style,
                "prompt": prompt,
                "timestamp": timestamp,
                "metadata": {
                    "model": style,
                    "steps": DEFAULT_INFERENCE_STEPS,
                    "guidance_scale": DEFAULT_GUIDANCE_SCALE,
                    "size": f"{generation_kwargs['width']}x{generation_kwargs['height']}",
                    "generation_time": f"{generation_time:.2f}s"
                }
            }

        except Exception as e:
            logger.error(f"Error generating image: {e}")

            self.unload_all_models()
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()

            error_message = "Model loading issue. Please try again." if "meta tensor" in str(e).lower() else str(e)
            return {
                "success": False,
                "error": error_message
            }

        finally:
            self.generation_lock = False

    def cleanup_old_images(self, max_images=MAX_IMAGES_TO_KEEP):
        """Remove old generated images to save disk space"""
        try:
            image_files = []
            for ext in ["*.png", "*.jpg", "*.jpeg"]:
                image_files.extend(glob.glob(os.path.join(IMAGES_DIR, ext)))

            if len(image_files) > max_images:
                image_files.sort(key=os.path.getmtime)
                for old_file in image_files[:-max_images]:
                    os.remove(old_file)
                    logger.info(f"Removed old image: {os.path.basename(old_file)}")
        except Exception as e:
            logger.error(f"Error during image cleanup: {e}")

    def get_memory_usage(self):
        """Get current memory usage in MB"""
        try:
            process = psutil.Process()
            memory_mb = process.memory_info().rss / 1024 / 1024

            gpu_memory = 0
            if torch.cuda.is_available():
                gpu_memory = torch.cuda.memory_allocated() / 1024 / 1024

            return {
                "cpu_memory_mb": memory_mb,
                "gpu_memory_mb": gpu_memory,
                "models_loaded": len(self.model_cache)
            }
        except Exception as e:
            logger.error(f"Error getting memory usage: {e}")
            return {"cpu_memory_mb": 0, "gpu_memory_mb": 0, "models_loaded": 0}
