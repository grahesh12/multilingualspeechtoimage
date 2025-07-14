"""
Text processing routes for translation and text handling
"""

import logging
from flask import Blueprint, request, jsonify
from utils.translation import TranslationService
from utils.validators import validate_prompt
from middleware.error_handler import handle_errors
from middleware.rate_limiter import rate_limit

logger = logging.getLogger(__name__)

def create_text_routes(translation_service: TranslationService):
    """Create text processing blueprint with routes"""
    text_bp = Blueprint('text', __name__)
    
    @text_bp.route('/api/text', methods=['POST'])
    @handle_errors
    @rate_limit(max_requests=20, window=60)
    def receive_text():
        """Process text and translate to English"""
        try:
            data = request.get_json()
            if not data or 'text' not in data:
                return jsonify({'error': 'Text field is required'}), 400
            
            text = data.get('text')
            if not text or not text.strip():
                return jsonify({'error': 'Text cannot be empty'}), 400
            
            logger.info(f"Received text: {text[:100]}...")
            
            # Translate to English
            result = translation_service.translate_to_english(text)
            
            if result['success']:
                return jsonify({
                    'status': 'success',
                    'data': {
                        'original_text': result['original_text'],
                        'translation': result['translation'],
                        'source_language': result['source_language'],
                        'target_language': result['target_language']
                    }
                }), 200
            else:
                return jsonify({
                    'status': 'error',
                    'message': result['error'],
                    'original_text': result['original_text']
                }), 500
                
        except Exception as e:
            logger.error(f"Text processing error: {e}")
            return jsonify({'error': 'Text processing failed'}), 500
    
    @text_bp.route('/api/text/detect-language', methods=['POST'])
    @handle_errors
    @rate_limit(max_requests=20, window=60)
    def detect_language():
        """Detect the language of the provided text"""
        try:
            data = request.get_json()
            if not data or 'text' not in data:
                return jsonify({'error': 'Text field is required'}), 400
            
            text = data.get('text')
            if not text or not text.strip():
                return jsonify({'error': 'Text cannot be empty'}), 400
            
            # Detect language
            result = translation_service.detect_language(text)
            
            if result['success']:
                return jsonify({
                    'status': 'success',
                    'data': {
                        'language': result['language'],
                        'confidence': result['confidence']
                    }
                }), 200
            else:
                return jsonify({
                    'status': 'error',
                    'message': result['error']
                }), 500
                
        except Exception as e:
            logger.error(f"Language detection error: {e}")
            return jsonify({'error': 'Language detection failed'}), 500
    
    return text_bp 