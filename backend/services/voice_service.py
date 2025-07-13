"""
Voice processing service for audio transcription
"""

import os
import tempfile
import whisper
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self, model_name="base"):
        """Initialize voice service with Whisper model"""
        self.model = whisper.load_model(model_name)
        logger.info(f"Voice service initialized with model: {model_name}")
    
    def transcribe_audio(self, audio_file):
        """Transcribe audio file to text"""
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
                audio_file.save(temp_audio.name)
                temp_audio_path = temp_audio.name
            
            try:
                # Transcribe original language
                original_result = self.model.transcribe(temp_audio_path)
                
                # Transcribe with translation to English
                translated_result = self.model.transcribe(
                    temp_audio_path,
                    task="translate",
                    language="en"
                )
                
                original_text = original_result.get('text', '').strip()
                translated_text = translated_result.get('text', '').strip()
                
                if not original_text:
                    return {
                        'success': False,
                        'error': 'Could not transcribe audio. Please ensure the audio is clear and contains speech.'
                    }
                
                return {
                    'success': True,
                    'original_text': original_text,
                    'translated_text': translated_text,
                    'language': original_result.get('language', 'unknown'),
                    'confidence': original_result.get('segments', [{}])[0].get('avg_logprob', 0) if original_result.get('segments') else 0
                }
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_audio_path):
                    os.remove(temp_audio_path)
                    
        except Exception as e:
            logger.error(f"Transcription error: {e}")
            return {
                'success': False,
                'error': f'Transcription failed: {str(e)}'
            }
    
    def get_model_info(self):
        """Get information about the loaded model"""
        return {
            'model_name': self.model.name,
            'model_size': getattr(self.model, 'model_size', 'unknown'),
            'multilingual': getattr(self.model, 'is_multilingual', False)
        } 