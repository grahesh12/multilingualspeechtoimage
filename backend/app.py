"""
Modular Flask application for Voice2Vision AI image generation
"""

import os
import logging
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Import services
from services.image_service import ImageService
from services.voice_service import VoiceService
from services.user_service import UserService
from utils.translation import TranslationService

# Import route factories
from routes.auth_routes import create_auth_routes
from routes.image_routes import create_image_routes
from routes.voice_routes import create_voice_routes
from routes.text_routes import create_text_routes
from routes.system_routes import create_system_routes

# Import middleware
from middleware.error_handler import handle_errors

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app)
    
    # === Configuration ===
    app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/ai_image_app")
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key")
    app.config["DEBUG"] = os.environ.get("DEBUG", "False").lower() == "true"
    
    # Initialize extensions
    mongo = PyMongo()
    bcrypt = Bcrypt()
    jwt = JWTManager()
    
    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Initialize services
    image_service = ImageService()
    image_service.set_mongo(mongo)  # Set mongo reference for database operations
    voice_service = VoiceService()
    user_service = UserService(mongo, bcrypt)
    translation_service = TranslationService()
    
    # Register blueprints
    auth_bp = create_auth_routes(user_service, mongo, bcrypt)
    image_bp = create_image_routes(image_service, user_service)
    voice_bp = create_voice_routes(voice_service)
    text_bp = create_text_routes(translation_service)
    system_bp = create_system_routes(image_service, user_service, mongo)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(image_bp)
    app.register_blueprint(voice_bp)
    app.register_blueprint(text_bp)
    app.register_blueprint(system_bp)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"error": "Token has expired"}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"error": "Invalid token"}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"error": "Missing authorization token"}, 401
    
    # Global error handler
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Endpoint not found"}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return {"error": "Internal server error"}, 500
    
    logger.info("Modular Flask application created successfully")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", 5000)),
        debug=app.config["DEBUG"]
    ) 