"""
Image generation routes for AI image creation
"""

import logging
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.image_service import ImageService
from services.user_service import UserService
from utils.validators import validate_prompt, validate_file_upload
from middleware.error_handler import handle_errors
from middleware.rate_limiter import rate_limit
from config import IMAGES_DIR
from datetime import datetime

logger = logging.getLogger(__name__)

def create_image_routes(image_service: ImageService, user_service: UserService):
    """Create image generation blueprint with routes"""
    image_bp = Blueprint('image', __name__)
    
    @image_bp.route('/api/generate', methods=['POST'])
    @jwt_required()
    @handle_errors
    @rate_limit(max_requests=5, window=60)
    def generate_image():
        """Generate AI image from text prompt"""
        try:
            username = get_jwt_identity()
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'Request data is required'}), 400
            prompt = data.get('prompt', '').strip()
            style = data.get('artStyle')
            
            # Validate prompt
            is_valid, error_msg = validate_prompt(prompt)
            if not is_valid:
                return jsonify({'error': error_msg}), 400
            
            # Check user credits
            user = user_service.get_user_by_username(username)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            if user.get('credits', 0) < 1:
                return jsonify({'error': 'Insufficient credits'}), 402
            
            logger.info(f"Image generation request from {username}: {prompt[:100]}...")
            
            # Generate image
            result = image_service.generate_image(prompt, style)
            
            if result['success']:
                # Deduct credits
                credit_result = user_service.deduct_credits(username, 1)
                if not credit_result['success']:
                    logger.error(f"Failed to deduct credits for {username}")
                return jsonify({
                    'status': 'success',
                    'data': {
                        'message': 'Image generated successfully',
                        'image_url': f"/images/{result['filename']}",
                        'filename': result['filename'],
                        'generation_time': result['generation_time'],
                        'style_used': result['style_used'],
                        'credits_remaining': user.get('credits', 0) - 1
                    }
                }), 200
            else:
                return jsonify({
                    'status': 'error',
                    'message': result['error']
                }), 500
                
        except Exception as e:
            logger.error(f"Image generation error: {e}")
            print(f"Image generation error: {e}")  # Print error to terminal for debugging
            return jsonify({'error': 'Image generation failed'}), 500
    
    @image_bp.route('/api/gallery', methods=['GET'])
    @jwt_required()
    @handle_errors
    def get_user_gallery():
        """Get user's image gallery"""
        try:
            username = get_jwt_identity()
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            style_filter = request.args.get('style')
            
            # Validate pagination
            if page < 1:
                page = 1
            if per_page < 1 or per_page > 50:
                per_page = 10
            
            # Build query
            query = {'username': username}
            if style_filter:
                query['style'] = style_filter
            
            # Get total count
            total_images = image_service.mongo.db.images.count_documents(query)
            
            # Calculate pagination
            skip = (page - 1) * per_page
            total_pages = (total_images + per_page - 1) // per_page
            
            # Get images
            images = list(image_service.mongo.db.images.find(query)
                         .sort('created_at', -1)
                         .skip(skip)
                         .limit(per_page))
            
            # Format response
            formatted_images = []
            for img in images:
                formatted_images.append({
                    'id': str(img['_id']),
                    'filename': img['filename'],
                    'image_url': f"/images/{img['filename']}",
                    'prompt': img['prompt'],
                    'style': img.get('style', 'unknown'),
                    'created_at': img['created_at'],
                    'generation_time': img.get('generation_time', 0)
                })
            
            return jsonify({
                'status': 'success',
                'data': {
                    'images': formatted_images,
                    'pagination': {
                        'page': page,
                        'per_page': per_page,
                        'total_images': total_images,
                        'total_pages': total_pages,
                        'has_next': page < total_pages,
                        'has_prev': page > 1
                    }
                }
            }), 200
            
        except Exception as e:
            logger.error(f"Gallery error: {e}")
            return jsonify({'error': 'Failed to fetch gallery'}), 500
    
    @image_bp.route('/images/<filename>')
    @handle_errors
    def serve_image(filename):
        """Serve generated images"""
        try:
            return send_from_directory(IMAGES_DIR, filename)
        except Exception as e:
            logger.error(f"Error serving image {filename}: {e}")
            return jsonify({'error': 'Image not found'}), 404
    
    @image_bp.route('/api/feedback', methods=['POST'])
    @jwt_required()
    @handle_errors
    @rate_limit(max_requests=5, window=60)
    def submit_feedback():
        """Submit feedback for generated images"""
        try:
            username = get_jwt_identity()
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'Feedback data is required'}), 400
            
            image_id = data.get('image_id')
            rating = data.get('rating')
            comment = data.get('comment', '').strip()
            
            if not image_id:
                return jsonify({'error': 'Image ID is required'}), 400
            
            if rating is None or not isinstance(rating, int) or rating < 1 or rating > 5:
                return jsonify({'error': 'Rating must be between 1 and 5'}), 400
            
            # Validate image belongs to user
            image = image_service.mongo.db.images.find_one({
                '_id': image_id,
                'username': username
            })
            
            if not image:
                return jsonify({'error': 'Image not found'}), 404
            
            # Save feedback
            feedback = {
                'image_id': image_id,
                'username': username,
                'rating': rating,
                'comment': comment,
                'created_at': datetime.utcnow()
            }
            
            result = image_service.mongo.db.feedback.insert_one(feedback)
            
            logger.info(f"Feedback submitted by {username} for image {image_id}")
            
            return jsonify({
                'status': 'success',
                'data': {
                    'message': 'Feedback submitted successfully',
                    'feedback_id': str(result.inserted_id)
                }
            }), 201
            
        except Exception as e:
            logger.error(f"Feedback submission error: {e}")
            return jsonify({'error': 'Failed to submit feedback'}), 500
    
    return image_bp 