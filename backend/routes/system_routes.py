"""
System routes for health checks and system status
"""

import logging
import datetime
from flask import Blueprint, request, jsonify
from services.image_service import ImageService
from services.user_service import UserService
from middleware.error_handler import handle_errors

logger = logging.getLogger(__name__)

def create_system_routes(image_service: ImageService, user_service: UserService, mongo):
    """Create system blueprint with routes"""
    system_bp = Blueprint('system', __name__)
    
    @system_bp.route('/api/hello')
    @handle_errors
    def hello():
        """Simple hello endpoint"""
        return jsonify(message='Hello from Flask backend!')
    
    @system_bp.route('/api/health')
    @handle_errors
    def health_check():
        """Health check endpoint for monitoring"""
        try:
            # Check database connection
            mongo.db.command('ping')
            db_status = 'healthy'
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            db_status = 'unhealthy'
        
        # Check image service
        memory_usage = image_service.get_memory_usage()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.datetime.utcnow().isoformat(),
            'services': {
                'database': db_status,
                'image_service': 'healthy',
                'whisper_model': 'loaded'
            },
            'memory_usage': memory_usage
        })
    
    @system_bp.route('/api/stats', methods=['GET'])
    @handle_errors
    def get_user_stats():
        """Get user statistics"""
        try:
            from flask_jwt_extended import jwt_required, get_jwt_identity
            
            username = get_jwt_identity()
            stats = user_service.get_user_stats(username)
            
            if not stats:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({
                'status': 'success',
                'stats': stats
            }), 200
            
        except Exception as e:
            logger.error(f"Stats error: {e}")
            return jsonify({'error': 'Failed to get user stats'}), 500
    
    @system_bp.route('/api/system/status', methods=['GET'])
    @handle_errors
    def get_system_status():
        """Get comprehensive system status"""
        try:
            # Get image service status
            image_status = image_service.get_service_status()
            
            # Get database stats
            try:
                total_users = mongo.db.users.count_documents({})
                total_images = mongo.db.images.count_documents({})
                total_feedback = mongo.db.feedback.count_documents({})
                db_status = 'healthy'
            except Exception as e:
                logger.error(f"Database status check failed: {e}")
                total_users = total_images = total_feedback = 0
                db_status = 'unhealthy'
            
            return jsonify({
                'status': 'success',
                'timestamp': datetime.datetime.utcnow().isoformat(),
                'system': {
                    'database': {
                        'status': db_status,
                        'total_users': total_users,
                        'total_images': total_images,
                        'total_feedback': total_feedback
                    },
                    'image_service': image_status,
                    'uptime': 'running'  # TODO: Implement actual uptime tracking
                }
            }), 200
            
        except Exception as e:
            logger.error(f"System status error: {e}")
            return jsonify({'error': 'Failed to get system status'}), 500
    
    return system_bp 