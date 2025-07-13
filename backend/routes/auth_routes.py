"""
Authentication routes for user management
"""

import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.user_service import UserService
from middleware.error_handler import handle_errors

logger = logging.getLogger(__name__)

def create_auth_routes(user_service: UserService, mongo, bcrypt):
    """Create authentication blueprint with routes"""
    auth_bp = Blueprint('auth', __name__)
    
    @auth_bp.route('/api/signup', methods=['POST'])
    @handle_errors
    def signup():
        """User registration endpoint"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Request data is required'}), 400
            
            username = data.get('username', '').strip()
            password = data.get('password', '')
            plan = data.get('plan', 'Free')
            
            if not username or not password:
                return jsonify({'error': 'Username and password are required'}), 400
            
            result = user_service.create_user(username, password, plan)
            
            if result['success']:
                return jsonify({
                    'status': 'success',
                    'message': 'Account created successfully',
                    'user': result['user']
                }), 201
            else:
                return jsonify({'error': result['error']}), 400
                
        except Exception as e:
            logger.error(f"Signup error: {e}")
            return jsonify({'error': 'Failed to create account'}), 500
    
    @auth_bp.route('/api/login', methods=['POST'])
    @handle_errors
    def login():
        """User login endpoint"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Request data is required'}), 400
            
            username = data.get('username', '').strip()
            password = data.get('password', '')
            
            if not username or not password:
                return jsonify({'error': 'Username and password are required'}), 400
            
            result = user_service.authenticate_user(username, password)
            
            if result['success']:
                return jsonify({
                    'status': 'success',
                    'message': 'Login successful',
                    'access_token': result['access_token'],
                    'user': result['user']
                }), 200
            else:
                return jsonify({'error': result['error']}), 401
                
        except Exception as e:
            logger.error(f"Login error: {e}")
            return jsonify({'error': 'Login failed'}), 500
    
    @auth_bp.route('/api/me', methods=['GET'])
    @jwt_required()
    @handle_errors
    def me():
        """Get current user information"""
        try:
            username = get_jwt_identity()
            user = user_service.get_user_by_username(username)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            if not user.get('is_active', True):
                return jsonify({'error': 'Account is deactivated'}), 401
            
            return jsonify({
                'status': 'success',
                'user': {
                    'username': user['username'],
                    'plan': user.get('plan', 'Free'),
                    'credits': user.get('credits', 0),
                    'created_at': user.get('created_at'),
                    'last_login': user.get('last_login'),
                    'profile': user.get('profile', {})
                }
            }), 200
            
        except Exception as e:
            logger.error(f"Error getting user info: {e}")
            return jsonify({'error': 'Failed to get user information'}), 500
    
    @auth_bp.route('/api/profile', methods=['PUT'])
    @jwt_required()
    @handle_errors
    def update_profile():
        """Update user profile"""
        try:
            username = get_jwt_identity()
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'Profile data is required'}), 400
            
            result = user_service.update_user_profile(username, data)
            
            if result['success']:
                return jsonify({
                    'status': 'success',
                    'message': result['message']
                }), 200
            else:
                return jsonify({'error': result['error']}), 400
                
        except Exception as e:
            logger.error(f"Profile update error: {e}")
            return jsonify({'error': 'Failed to update profile'}), 500
    
    @auth_bp.route('/api/change-password', methods=['POST'])
    @jwt_required()
    @handle_errors
    def change_password():
        """Change user password"""
        try:
            username = get_jwt_identity()
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'Password data is required'}), 400
            
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            
            if not current_password or not new_password:
                return jsonify({'error': 'Current and new passwords are required'}), 400
            
            result = user_service.change_password(username, current_password, new_password)
            
            if result['success']:
                return jsonify({
                    'status': 'success',
                    'message': result['message']
                }), 200
            else:
                return jsonify({'error': result['error']}), 400
                
        except Exception as e:
            logger.error(f"Password change error: {e}")
            return jsonify({'error': 'Failed to change password'}), 500
    
    @auth_bp.route('/api/refresh', methods=['POST'])
    @jwt_required()
    @handle_errors
    def refresh_token():
        """Refresh access token"""
        try:
            username = get_jwt_identity()
            return jsonify({
                'status': 'success',
                'message': 'Token is still valid',
                'username': username
            }), 200
            
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            return jsonify({'error': 'Token refresh failed'}), 500
    
    @auth_bp.route('/api/logout', methods=['POST'])
    @jwt_required()
    @handle_errors
    def logout():
        """User logout endpoint"""
        try:
            # In a real application, you might want to blacklist the token
            # For now, we'll just return a success message
            return jsonify({
                'status': 'success',
                'message': 'Logged out successfully'
            }), 200
            
        except Exception as e:
            logger.error(f"Logout error: {e}")
            return jsonify({'error': 'Logout failed'}), 500
    
    return auth_bp 