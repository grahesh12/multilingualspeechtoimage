"""
User management service for handling user operations
"""

import logging
from datetime import datetime, timedelta
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from utils.validators import validate_username, validate_password, validate_plan

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, mongo: PyMongo, bcrypt: Bcrypt):
        self.mongo = mongo
        self.bcrypt = bcrypt
    
    def create_user(self, username, password, plan='Free'):
        """Create a new user account"""
        try:
            # Validate input
            is_valid, error_msg = validate_username(username)
            if not is_valid:
                return {'success': False, 'error': error_msg}
            
            is_valid, error_msg = validate_password(password)
            if not is_valid:
                return {'success': False, 'error': error_msg}
            
            is_valid, error_msg = validate_plan(plan)
            if not is_valid:
                return {'success': False, 'error': error_msg}
            
            # Check if username already exists
            if self.mongo.db.users.find_one({'username': username}):
                return {'success': False, 'error': 'Username already exists'}
            
            # Hash password
            pw_hash = self.bcrypt.generate_password_hash(password).decode('utf-8')
            
            # Create user
            user = {
                'username': username,
                'password': pw_hash,
                'plan': plan,
                'credits': 25 if plan == 'Free' else 100,
                'created_at': datetime.utcnow(),
                'last_login': None,
                'is_active': True,
                'profile': {
                    'display_name': username,
                    'bio': '',
                    'avatar_url': None
                }
            }
            
            result = self.mongo.db.users.insert_one(user)
            logger.info(f"New user registered: {username} (plan: {plan})")
            
            return {
                'success': True,
                'user': {
                    'username': username,
                    'plan': plan,
                    'credits': user['credits']
                }
            }
            
        except Exception as e:
            logger.error(f"User creation error: {e}")
            return {'success': False, 'error': 'Failed to create account'}
    
    def authenticate_user(self, username, password):
        """Authenticate user login"""
        try:
            user = self.mongo.db.users.find_one({'username': username})
            if not user:
                logger.warning(f"Login attempt with non-existent username: {username}")
                return {'success': False, 'error': 'Invalid username or password'}
            
            if not user.get('is_active', True):
                return {'success': False, 'error': 'Account is deactivated'}
            
            if not self.bcrypt.check_password_hash(user['password'], password):
                logger.warning(f"Failed login attempt for user: {username}")
                return {'success': False, 'error': 'Invalid username or password'}
            
            # Update last login
            self.mongo.db.users.update_one(
                {'username': username},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            
            # Create access token
            access_token = create_access_token(
                identity=username,
                expires_delta=timedelta(days=7)
            )
            
            logger.info(f"Successful login: {username}")
            
            return {
                'success': True,
                'access_token': access_token,
                'user': {
                    'username': username,
                    'plan': user.get('plan', 'Free'),
                    'credits': user.get('credits', 0),
                    'profile': user.get('profile', {})
                }
            }
            
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return {'success': False, 'error': 'Login failed'}
    
    def get_user_by_username(self, username):
        """Get user by username"""
        try:
            user = self.mongo.db.users.find_one({'username': username})
            if not user:
                return None
            
            # Remove sensitive data
            user.pop('password', None)
            return user
            
        except Exception as e:
            logger.error(f"Error getting user {username}: {e}")
            return None
    
    def update_user_profile(self, username, profile_data):
        """Update user profile"""
        try:
            update_data = {}
            
            if 'display_name' in profile_data:
                update_data['profile.display_name'] = profile_data['display_name']
            if 'bio' in profile_data:
                update_data['profile.bio'] = profile_data['bio']
            if 'avatar_url' in profile_data:
                update_data['profile.avatar_url'] = profile_data['avatar_url']
            
            if not update_data:
                return {'success': False, 'error': 'No valid profile data provided'}
            
            result = self.mongo.db.users.update_one(
                {'username': username},
                {'$set': update_data}
            )
            
            if result.modified_count > 0:
                return {'success': True, 'message': 'Profile updated successfully'}
            else:
                return {'success': False, 'error': 'No changes made'}
                
        except Exception as e:
            logger.error(f"Profile update error for {username}: {e}")
            return {'success': False, 'error': 'Failed to update profile'}
    
    def change_password(self, username, current_password, new_password):
        """Change user password"""
        try:
            user = self.mongo.db.users.find_one({'username': username})
            if not user:
                return {'success': False, 'error': 'User not found'}
            
            # Verify current password
            if not self.bcrypt.check_password_hash(user['password'], current_password):
                return {'success': False, 'error': 'Current password is incorrect'}
            
            # Validate new password
            is_valid, error_msg = validate_password(new_password)
            if not is_valid:
                return {'success': False, 'error': error_msg}
            
            # Hash new password
            new_pw_hash = self.bcrypt.generate_password_hash(new_password).decode('utf-8')
            
            # Update password
            result = self.mongo.db.users.update_one(
                {'username': username},
                {'$set': {'password': new_pw_hash}}
            )
            
            if result.modified_count > 0:
                logger.info(f"Password changed for user: {username}")
                return {'success': True, 'message': 'Password changed successfully'}
            else:
                return {'success': False, 'error': 'Failed to update password'}
                
        except Exception as e:
            logger.error(f"Password change error for {username}: {e}")
            return {'success': False, 'error': 'Failed to change password'}
    
    def deduct_credits(self, username, amount):
        """Deduct credits from user account"""
        try:
            result = self.mongo.db.users.update_one(
                {'username': username, 'credits': {'$gte': amount}},
                {'$inc': {'credits': -amount}}
            )
            
            if result.modified_count > 0:
                return {'success': True}
            else:
                return {'success': False, 'error': 'Insufficient credits'}
                
        except Exception as e:
            logger.error(f"Credit deduction error for {username}: {e}")
            return {'success': False, 'error': 'Failed to deduct credits'}
    
    def get_user_stats(self, username):
        """Get user statistics"""
        try:
            user = self.mongo.db.users.find_one({'username': username})
            if not user:
                return None
            
            # Get user's images count
            images_count = self.mongo.db.images.count_documents({'username': username})
            
            return {
                'username': username,
                'plan': user.get('plan', 'Free'),
                'credits': user.get('credits', 0),
                'created_at': user.get('created_at'),
                'last_login': user.get('last_login'),
                'images_count': images_count,
                'profile': user.get('profile', {})
            }
            
        except Exception as e:
            logger.error(f"Error getting stats for {username}: {e}")
            return None 