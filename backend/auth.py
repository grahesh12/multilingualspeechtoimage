from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask import current_app as app
from datetime import timedelta

# Initialize extensions (to be initialized in app.py)
mongo = PyMongo()
bcrypt = Bcrypt()

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    plan = data.get('plan', 'Free')
    if not username or not password:
        return jsonify({'msg': 'Username and password required'}), 400
    if mongo.db.users.find_one({'username': username}):
        return jsonify({'msg': 'Username already exists'}), 409
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = {'username': username, 'password': pw_hash, 'plan': plan, 'credits': 25}
    mongo.db.users.insert_one(user)
    return jsonify({'msg': 'Signup successful'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = mongo.db.users.find_one({'username': username})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'msg': 'Invalid username or password'}), 401
    access_token = create_access_token(identity=username, expires_delta=timedelta(days=7))
    return jsonify({'access_token': access_token, 'username': username, 'plan': user.get('plan', 'Free')}), 200

@auth_bp.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    username = get_jwt_identity()
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    return jsonify({'username': user['username'], 'plan': user.get('plan', 'Free'), 'credits': user.get('credits', 0)}), 200 