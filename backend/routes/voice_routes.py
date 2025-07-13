"""
Voice processing routes for audio transcription
"""

import logging
from flask import Blueprint, request, jsonify
from services.voice_service import VoiceService
from utils.validators import validate_file_upload
from middleware.error_handler import handle_errors
from middleware.rate_limiter import rate_limit

logger = logging.getLogger(__name__)

def create_voice_routes(voice_service: VoiceService):
    """Create voice processing blueprint with routes"""
    voice_bp = Blueprint('voice', __name__)
    
    @voice_bp.route('/api/voice', methods=['POST'])
    @handle_errors
    @rate_limit(max_requests=10, window=60)
    def receive_voice():
        """Process voice file and transcribe to text"""
        try:
            if 'voice' not in request.files:
                return jsonify({'error': 'No file uploaded'}), 400
            
            file = request.files['voice']
            
            # Validate file
            allowed_extensions = ('.wav', '.mp3', '.m4a', '.ogg', '.flac')
            is_valid, error_msg = validate_file_upload(file, allowed_extensions, 25)
            if not is_valid:
                return jsonify({'error': error_msg}), 400
            
            logger.info(f"Processing voice file: {file.filename}")
            
            # Transcribe audio
            result = voice_service.transcribe_audio(file)
            
            if result['success']:
                return jsonify({
                    'status': 'success',
                    'original_text': result['original_text'],
                    'translated_text': result['translated_text'],
                    'language': result['language'],
                    'confidence': result['confidence']
                }), 200
            else:
                return jsonify({
                    'status': 'error',
                    'message': result['error']
                }), 400
                
        except Exception as e:
            logger.error(f"Voice processing error: {e}")
            return jsonify({'error': 'Voice processing failed'}), 500
    
    @voice_bp.route('/api/voice/model-info', methods=['GET'])
    @handle_errors
    def get_model_info():
        """Get information about the voice model"""
        try:
            model_info = voice_service.get_model_info()
            return jsonify({
                'status': 'success',
                'model_info': model_info
            }), 200
        except Exception as e:
            logger.error(f"Error getting model info: {e}")
            return jsonify({'error': 'Failed to get model information'}), 500
    
    return voice_bp 