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

#Rutas para roomies
@api.route('/roomie', methods=['GET'])
def get_roomies():
    roomies= Roomie.query.all()
    all_roomies = list(map(lambda item: item.serialize(), roomies))
    if all_roomies == []:
         return jsonify({'error': 'No hay roomies registrados'}), 404
    return jsonify(all_roomies), 200

@api.route('/roomie/<int:roomie_id>', methods=['GET'])
def get_one_roomie(roomie_id):
    chosen_roomie = Roomie.query.filter_by(id=roomie_id).first()
    if chosen_roomie is None:
        return jsonify({'error': 'Este roomie no existe'}), 404
    return jsonify(chosen_roomie.serialize()), 200

@api.route('/roomie/<int:roomie_id>', methods=['PUT'])
def updated_roomie(roomie_id):
    request_body_roomie = request.get_json()
    chosen_roomie = Roomie.query.get(roomie_id)
    if chosen_roomie is None:
        return jsonify({'error': 'Este roomie no existe'}), 404
    if 'email' in request_body_roomie:
        new_email = request_body_roomie['email']
        if Roomie.query.filter_by(email=new_email).first() is None:
            chosen_roomie.email = new_email
        else:
            return jsonify({'error': 'Este email ya existe'}), 400
    if 'password' in request_body_roomie:
        chosen_roomie.password = request_body_roomie['password']
    if 'first_name' in request_body_roomie:
        chosen_roomie.first_name = request_body_roomie['first_name']
    if 'last_name' in request_body_roomie:
        chosen_roomie.last_name = request_body_roomie['last_name']
    if 'phone_number' in request_body_roomie:
        new_phone_number = request_body_roomie['phone_number']
        if Roomie.query.filter_by(phone_number=new_phone_number).first() is None:
            chosen_roomie.phone_number = new_phone_number
        else:
            return jsonify({'error': 'Este teléfono ya existe'}), 400
    if 'avatar' in request_body_roomie:
        chosen_roomie.avatar = request_body_roomie['avatar']
    if 'paypal_id' in request_body_roomie:
        chosen_roomie.paypal_id = request_body_roomie['paypal_id']
    db.session.commit()
    return jsonify('Roomie actualizado correctamente'), 200

@api.route('/roomie/<int:roomie_id>', methods=['DELETE'])
def delete_roomie(roomie_id):
    chosen_roomie = Roomie.query.get(roomie_id)
    if chosen_roomie is None:
        return jsonify({'error': 'Este roomie no existe'}), 404
    db.session.delete(chosen_roomie)
    db.session.commit()
    return jsonify('Roomie eliminado correctamente'), 200


