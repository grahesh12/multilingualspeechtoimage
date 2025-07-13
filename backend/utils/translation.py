"""
Translation utilities for text processing
"""

import logging
from googletrans import Translator

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.translator = Translator()
    
    def translate_to_english(self, text):
        """Translate text to English"""
        try:
            translation = self.translator.translate(text, dest='en')
            return {
                'success': True,
                'original_text': text,
                'translation': translation.text,
                'source_language': translation.src,
                'target_language': translation.dest
            }
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return {
                'success': False,
                'error': 'Translation failed',
                'original_text': text
            }
    
    def detect_language(self, text):
        """Detect the language of the text"""
        try:
            detection = self.translator.detect(text)
            return {
                'success': True,
                'language': detection.lang,
                'confidence': detection.confidence
            }
        except Exception as e:
            logger.error(f"Language detection error: {e}")
            return {
                'success': False,
                'error': 'Language detection failed'
            } 