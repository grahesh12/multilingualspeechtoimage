#!/usr/bin/env python3
"""
Voice2Vision Backend - Modular Flask Application
Run script for development and production
"""

import os
import sys
from app import create_app

def main():
    """Main entry point for the application"""
    # Create the Flask application
    app = create_app()
    
    # Get configuration from environment
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting Voice2Vision Backend...")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🐛 Debug: {debug}")
    print(f"🌐 URL: http://{host}:{port}")
    
    # Run the application
    app.run(
        host=host,
        port=port,
        debug=True
    )

if __name__ == "__main__":
    main() 