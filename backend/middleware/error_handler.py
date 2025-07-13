"""
Error handling middleware for the Flask application
"""

import logging
import traceback
from functools import wraps
from flask import jsonify, current_app

logger = logging.getLogger(__name__)

def handle_errors(f):
    """Decorator to handle errors in route functions"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({
                'status': 'error',
                'message': 'Internal server error',
                'error': str(e) if current_app.debug else 'Something went wrong'
            }), 500
    return decorated_function 