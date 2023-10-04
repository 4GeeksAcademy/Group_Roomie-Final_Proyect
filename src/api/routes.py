"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Roomie, Home, Expenses, Debts, List, Items, Task, File, Blog, Notifications
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


api = Blueprint('api', __name__)


#Ruta para creación de token
@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    roomie = Roomie.filter.query(email=email, password=password).first()
    if Roomie is None:
        return jsonify({'message':'El email o la contraseña no son correctos'}), 401
    access_token = create_access_token(identity=roomie.id)
    return jsonify({ 'token': access_token, 'roomie_id': roomie.id })

#Ruta para registrar nuevo roomie
@api.route('/signup', methods=['POST'])
def create_roomie():
    data = request.get_json()
    required_fields = ['email', 'password', 'first_name', 'last_name', 'phone_number']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta {field} en los campos del formulario'}), 400
    email = data['email']
    password = data['password']
    first_name = data['first_name']
    last_name = data['last_name']
    phone_number = data['phone_number']
    avatar = data.get('avatar')
    paypal_id = data.get('paypal_id')
    existing_roomie = Roomie.query.filter_by(email=email).first()
    if existing_roomie:
        return jsonify({'error': 'Este roomie ya existe'}), 400
    new_roomie = Roomie(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        avatar=avatar,
        paypal_id=paypal_id
    )
    db.session.add(new_roomie)
    db.session.commit()
    return jsonify({'message': 'Nuevo roomie creado correctamente'}), 201

#Ruta para inicio de sesión
@api.route('/login', methods=['POST'])
def login_roomie():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    roomie = Roomie.query.filter_by(email=email).first()
    if not roomie or roomie.password != password:
        return jsonify({'error': 'El email o la contraseña no son correctos'}), 401
    create_token()



