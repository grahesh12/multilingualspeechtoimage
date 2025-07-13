import os
import tempfile
import whisper
from flask import Flask, jsonify, request
from flask_cors import CORS
from image_service import ImageService
from flask import send_from_directory
from config import IMAGES_DIR
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from auth import auth_bp, mongo, bcrypt
from googletrans import Translator
import datetime

app = Flask(__name__)
CORS(app)

# === Auth Config ===
app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/ai_image_app")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key")

# Initialize extensions
mongo.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

# Register auth blueprint
app.register_blueprint(auth_bp)

# Load Whisper model once at startup
# whisper_model = whisper.load_model("large")
whisper_model = whisper.load_model("base")

# Initialize image service
image_service = ImageService()

@app.route('/api/hello')
def hello():
    return jsonify(message='Hello from Flask backend!')

@app.route('/api/text', methods=['POST'])
def receive_text():
    data = request.get_json()
    text = data.get('text')
    print(text)
    # Translate to English
    translator = Translator()
    translation = translator.translate(text, dest='en')
    return jsonify({'status': 'received', 'text': text, 'translation': translation.text})

@app.route('/api/voice', methods=['POST'])
def receive_voice():
    if 'voice' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['voice']
    # Validate file type and size
    allowed_extensions = ('.wav', '.mp3', '.m4a')
    if file.filename == '' or not file.filename.lower().endswith(allowed_extensions):
        return jsonify({'error': 'Invalid file type. Please upload a WAV, MP3, or M4A audio file.'}), 400
    file.seek(0, 2)  # Move to end of file
    file_length = file.tell()
    file.seek(0)  # Reset pointer
    if file_length == 0:
        return jsonify({'error': 'Uploaded file is empty.'}), 400
    if file_length > 10 * 1024 * 1024:  # 10MB limit
        return jsonify({'error': 'File too large. Maximum allowed size is 10MB.'}), 400
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        file.save(temp_audio.name)
        temp_audio_path = temp_audio.name
    try:
        original_result = whisper_model.transcribe(temp_audio_path)
        translated_result = whisper_model.transcribe(
            temp_audio_path,
            task="translate",
            language="en"
        )
        os.remove(temp_audio_path)
        return jsonify({
            'status': 'file received',
            'filename': file.filename,
            'transcription': original_result.get('text', ''),
            'translation': translated_result.get('text', '')
        })
    except Exception as e:
        os.remove(temp_audio_path)
        return jsonify({'error': f'Failed to process audio: {str(e)}'}), 500

@app.route('/api/generate', methods=['POST'])
@jwt_required()
def generate_image():
    username = get_jwt_identity()
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404
    if user.get('credits', 0) < 5:
        return jsonify({'status': 'error', 'message': 'Insufficient credits', 'credits': user.get('credits', 0)}), 403
    # Deduct 5 credits
    mongo.db.users.update_one({'username': username}, {'$inc': {'credits': -5}})
    # Refresh user credits after deduction
    user = mongo.db.users.find_one({'username': username})
    
    data = request.get_json()
    prompt = data.get('prompt')
    negative_prompt = data.get('negativePrompt')
    art_style = data.get('artStyle')
    quality = data.get('quality')
    
    print(f"Received generation request:")
    print(f"Prompt: {prompt}")
    print(f"Negative Prompt: {negative_prompt}")
    print(f"Art Style: {art_style}")
    print(f"Quality: {quality}")
    
    # Map art style to model style
    style_mapping = {
        'realistic': 'realistic_vision',
        'anime': 'dreamshaper'
    }
    
    # Select model based on art style
    selected_style = style_mapping.get(art_style, 'realistic_vision')
    
    # Enhance prompt with quality and negative prompt
    enhanced_prompt = prompt
    if quality == 'hd':
        enhanced_prompt += ", high quality, detailed, sharp focus"
    elif quality == 'ultra':
        enhanced_prompt += ", ultra high quality, extremely detailed, professional photography"
    else:
        enhanced_prompt += ", good quality, clear"
    
    # Combine negative prompts
    base_negative = "blurry, low quality, distorted, deformed"
    if negative_prompt:
        full_negative_prompt = f"{base_negative}, {negative_prompt}"
    else:
        full_negative_prompt = base_negative
    
    try:
        # Generate image using the image service
        result = image_service.generate_image(
            prompt=enhanced_prompt,
            style=selected_style
        )
        
        if result['success']:
            # Store image metadata in MongoDB for gallery
            image_metadata = {
                'user_id': str(user['_id']),
                'username': username,
                'filename': result['filename'],
                'prompt': enhanced_prompt,
                'negative_prompt': full_negative_prompt,
                'art_style': art_style,
                'quality': quality,
                'style': result['style'],
                'created_at': datetime.datetime.utcnow(),
                'filepath': result['filepath']
            }
            mongo.db.generated_images.insert_one(image_metadata)
            
            return jsonify({
                'status': 'success',
                'message': 'Image generated successfully',
                'data': {
                    'filename': result['filename'],
                    'filepath': result['filepath'],
                    'style': result['style'],
                    'prompt': enhanced_prompt,
                    'negative_prompt': full_negative_prompt,
                    'art_style': art_style,
                    'quality': quality,
                    'metadata': result['metadata'],
                    'credits': user.get('credits', 0)
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['error']
            }), 500
            
    except Exception as e:
        print(f"Error generating image: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to generate image: {str(e)}'
        }), 500

@app.route('/api/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    try:
        username = get_jwt_identity()
        user = mongo.db.users.find_one({'username': username})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        rating = data.get('rating', 0)
        feedback_text = data.get('feedback', '').strip()
        category = data.get('category', 'general')
        
        # Validation
        if not feedback_text:
            return jsonify({'error': 'Feedback text is required'}), 400
        
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        valid_categories = ['general', 'bug', 'feature', 'performance']
        if category not in valid_categories:
            return jsonify({'error': 'Invalid category'}), 400
        
        # Store feedback in MongoDB
        feedback_doc = {
            'username': username,
            'rating': rating,
            'feedback': feedback_text,
            'category': category,
            'timestamp': datetime.datetime.utcnow(),
            'user_id': str(user['_id'])
        }
        
        mongo.db.feedback.insert_one(feedback_doc)
        
        return jsonify({
            'status': 'success',
            'message': 'Feedback submitted successfully'
        })
        
    except Exception as e:
        print(f"Error submitting feedback: {e}")
        return jsonify({'error': 'Failed to submit feedback'}), 500

@app.route('/api/gallery', methods=['GET'])
@jwt_required()
def get_user_gallery():
    try:
        username = get_jwt_identity()
        user = mongo.db.users.find_one({'username': username})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters for pagination and filtering
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 12))
        skip = (page - 1) * limit
        
        # Get user's generated images from MongoDB
        images_cursor = mongo.db.generated_images.find(
            {'user_id': str(user['_id'])},
            {'_id': 0}  # Exclude MongoDB _id
        ).sort('created_at', -1).skip(skip).limit(limit)
        
        images = list(images_cursor)
        
        # Add URL to each image and ensure created_at is an ISO string
        for image in images:
            image['url'] = f'http://localhost:5000/images/{image["filename"]}'
            image['id'] = str(image.get('_id', ''))
            if 'created_at' in image and hasattr(image['created_at'], 'isoformat'):
                image['created_at'] = image['created_at'].isoformat()
        
        # Get total count for pagination
        total_count = mongo.db.generated_images.count_documents({'user_id': str(user['_id'])})
        
        return jsonify({
            'status': 'success',
            'images': images,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'has_more': (skip + limit) < total_count
            }
        })
        
    except Exception as e:
        print(f"Error fetching gallery: {e}")
        return jsonify({'error': 'Failed to fetch gallery'}), 500

# Route to serve generated images
@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 

 