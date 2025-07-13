"""
Validation utilities for user input
"""

import re
import logging

logger = logging.getLogger(__name__)

def validate_username(username):
    """Validate username format"""
    if not username or len(username) < 3 or len(username) > 20:
        return False, "Username must be between 3 and 20 characters"
    
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"
    
    return True, ""

def validate_password(password):
    """Validate password strength"""
    if not password or len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    if len(password) > 128:
        return False, "Password is too long (max 128 characters)"
    
    # Check for at least one letter and one number
    if not re.search(r'[a-zA-Z]', password) or not re.search(r'\d', password):
        return False, "Password must contain at least one letter and one number"
    
    return True, ""

def validate_plan(plan):
    """Validate user plan"""
    valid_plans = ['Free', 'Pro', 'Enterprise']
    if plan not in valid_plans:
        return False, f"Invalid plan. Must be one of: {', '.join(valid_plans)}"
    return True, ""

def validate_prompt(prompt):
    """Validate image generation prompt"""
    if not prompt or not prompt.strip():
        return False, "Prompt is required"
    
    if len(prompt.strip()) > 1000:
        return False, "Prompt is too long (max 1000 characters)"
    
    return True, ""

def validate_file_upload(file, allowed_extensions, max_size_mb):
    """Validate file upload"""
    if not file or file.filename == '':
        return False, "No file uploaded"
    
    if not file.filename.lower().endswith(allowed_extensions):
        return False, f"Invalid file type. Please upload: {', '.join(allowed_extensions)}"
    
    # Check file size
    file.seek(0, 2)
    file_length = file.tell()
    file.seek(0)
    
    max_size = max_size_mb * 1024 * 1024
    if file_length == 0:
        return False, "Uploaded file is empty"
    if file_length > max_size:
        return False, f"File too large. Maximum allowed size is {max_size_mb}MB"
    
    return True, "" 