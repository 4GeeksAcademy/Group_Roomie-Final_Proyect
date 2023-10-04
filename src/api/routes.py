"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Roomie, Home, Expenses, Debts, List, Items, Task, File, Blog, Notifications
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime, timedelta

api = Blueprint('api', __name__)

#Ruta para creación de token
@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    roomie = Roomie.filter.query(email=email, password=password).first()
    if Roomie is None:
        return jsonify({'message':'El email o la contraseña no son correctos'}), 401
    access_token = create_access_token(identity={'roomie_id': roomie.id, 'is_admin': roomie.is_admin})
    return jsonify({ 'token': access_token, 'roomie_id': roomie.id, 'is_admin': roomie.is_admin })

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
    existing_email_roomie = Roomie.query.filter_by(email=email).first()
    if existing_email_roomie:
        return jsonify({'error': 'Este roomie ya existe'}), 400
    existing_phone_roomie = Roomie.query.filter_by(phone_number=phone_number).first()
    if existing_phone_roomie:
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
def get_all_roomies():
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


#Rutas para home
@api.route('/home', methods=['GET'])
def get_all_homes():
    homes= Home.query.all()
    all_homes = list(map(lambda item: item.serialize(), homes))
    if all_homes == []:
         return jsonify({'error': 'No hay viviendas registradas'}), 404
    return jsonify(all_homes), 200

@api.route('/home/<int:home_id>', methods=['GET'])
def get_one_home(home_id):
    chosen_home = Home.query.filter_by(id=home_id).first()
    if chosen_home is None:
        return jsonify({'error': 'Esta vivienda no existe'}), 404
    return jsonify(chosen_home.serialize()), 200

@api.route('/home', methods=['POST'])
@jwt_required()
def create_home():
    request_body_home = request.get_json()
    if 'name' not in request_body_home:
        return jsonify({'error': 'Es necesario introducir un nombre para la vivienda'}), 400
    roomie_id = get_jwt_identity()
    name = request_body_home['name']
    new_home = Home(name=name, roomie_id=roomie_id)
    shopping_list = List(home=new_home)
    db.session.add(new_home)
    db.session.add(shopping_list)
    updated_access_token = create_access_token(identity={
        'roomie_id': roomie_id,
        'is_admin': True
    })
    db.session.commit()
    return jsonify({'message': 'Vivienda creada correctamente', 'access_token': updated_access_token}), 200

@api.route('/home/<int:home_id>/<int:roomie_id>', methods=['POST'])
@jwt_required()
def add_roomie_to_home(home_id, roomie_id):
    home = Home.query.get(home_id)
    if home is None:
        return jsonify({'error': 'Esta vivienda no existe'}), 404
    if home.admin_id != get_jwt_identity():
        return jsonify({'error': 'No tienes permiso para añadir roomies a esta vivienda'}), 404
    roomie = Roomie.query.get(roomie_id)
    if roomie is None:
        return jsonify({'error': 'Este roomie no existe'}), 400
    home.roomies.append(roomie)
    db.session.commit()
    return jsonify({'message': 'Roomie añadido a la vivienda correctamente'}), 201

@api.route('/home/<int:home_id>/<int:roomie_id>', methods=['DELETE'])
@jwt_required()
def delete_roomie_from_home(home_id, roomie_id):
    current_roomie_id = get_jwt_identity()
    home = Home.query.get(home_id)
    if not home or home.admin_id != current_roomie_id:
        return jsonify({'error': 'No tienes permiso para eliminar a este roomie'}), 404
    roomie = Roomie.query.get(roomie_id)
    if not roomie or roomie not in home.roomies:
        return jsonify({'error': 'El roomie no pertenece a esta vivienda'}), 400
    roomie.home_id = None
    db.session.commit()
    return jsonify({'message': 'Roomie eliminado de la vivienda correctamente'}), 200

@api.route('/home/<int:home_id>', methods=['PUT'])
def inactive_home(home_id):
    chosen_home = Home.query.get(home_id)
    if chosen_home is None:
        return jsonify({'error': 'Esta vivienda no existe'}), 404
    roomies_in_home = Roomie.query.filter_by(home_id=home_id).all()
    for roomie in roomies_in_home:
        roomie.home_id = None
    chosen_home.admin_id = None
    chosen_home.is_active = False
    db.session.commit()
    return jsonify({'message': 'Vivienda eliminada correctamente'}), 200


#Rutas para tasks
@api.route('/task', methods=['GET'])
def get_all_tasks():
    tasks= Task.query.all()
    all_tasks = list(map(lambda item: item.serialize(), tasks))
    if all_tasks == []:
         return jsonify({'error': 'No hay tareas registradas'}), 404
    return jsonify(all_tasks), 200

@api.route('/task/<int:task_id>', methods=['GET'])
def get_one_task(task_id):
    chosen_task = Task.query.filter_by(id=task_id).first()
    if chosen_task is None:
        return jsonify({'error': 'Esta tarea no existe'}), 404
    return jsonify(chosen_task.serialize()), 200

@api.route('/task/<int:roomie_id>', methods=['GET'])
def get_tasks_by_roomie_id(roomie_id):
    tasks = Task.query.filter_by(roomie_id=roomie_id).all()
    task_list = [task.serialize() for task in tasks]
    return jsonify(task_list), 200

@api.route('/task', methods=['POST'])
def create_task():
    request_data = request.get_json()
    roomie_id = request_data.get('roomie_id')
    if roomie_id is None:
        return jsonify({'error': 'Es necesario asignar un roomie'}), 400
    new_task = Task(
        name=request_data.get('name'),
        date_added=request_data.get('date_added'),
        date_done=request_data.get('date_done'),
        done=request_data.get('done'),
        roomie_id=roomie_id
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Nueva tarea añadida correctamente' }), 200

@api.route('/task/<int:roomie_id>/<int:task_id>', methods=['DELETE'])
def delete_task(roomie_id, task_id):
    task = Task.query.get(task_id)
    if task is None:
        return jsonify({'error': 'La tarea no existe'}), 400
    if task.roomie_id != roomie_id:
        return jsonify({'error': 'Esta tarea no pertenece a este roomie'}), 400
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Tarea eliminada correctamente'}), 200


#Rutas para actualizaciones
@api.route('/blog', methods=['GET'])
def get_all_blogs():
    blogs= Blog.query.all()
    all_blogs = list(map(lambda item: item.serialize(), blogs))
    if all_blogs == []:
         return jsonify({'error': 'No hay actualizaciones registradas'}), 400
    return jsonify(all_blogs), 200

@api.route('/blog/<int:roomie_id>', methods=['GET'])
def get_blogs_by_roomie(roomie_id):
    blogs = Blog.query.filter_by(roomie_id=roomie_id).all()
    if not blogs:
        return jsonify({'error': 'No hay actualizaciones para este roomie'}), 400
    serialized_blogs = [blog.serialize() for blog in blogs]
    return jsonify(serialized_blogs), 200

@api.route('/task/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    task = Task.query.get(task_id)
    if task:
        task.done = True
        db.session.commit()
        new_blog = Blog(
            roomie_id=task.roomie_id,
            name=task.name,
            date=datetime.now(),
            status='Tarea completada',
            amount=None
        )
        db.session.add(new_blog)
        db.session.commit()
        return jsonify({'message': 'Tarea completada'}), 200
    else:
        return jsonify({'error': 'No se encontró la tarea'}), 400

@api.route('/list/<int:item_id>', methods=['POST'])
def purchase_item(item_id):
    item = Items.query.get(item_id)
    if item:
        item.checked = True
        db.session.commit()
        new_blog = Blog(
            roomie_id=item.roomie_id,
            name={item.name},
            date=datetime.now(),
            status='Comprado',
            amount=None
        )
        db.session.add(new_blog)
        db.session.commit()
        return jsonify({'message': 'Item comprado'}), 200
    else:
        return jsonify({'error': 'No se encontró el item'}), 400
    
@api.route('/debts/<int:debt_id>', methods=['POST'])
def pay_debt(debt_id):
    debt = Debts.query.get(debt_id)
    if debt:
        debt.status = 'Pagado'
        db.session.commit()
        new_blog = Blog(
            roomie_id=debt.roomie_id,
            name={debt.name},
            date=datetime.now(),
            status='Pagado',
            amount=debt.amount
        )
        db.session.add(new_blog)
        db.session.commit()
        return jsonify({'message': 'Deuda pagada'}), 200
    else:
        return jsonify({'error': 'No se encontró la deuda'}), 400

#PENDIENTE DE AÑADIR RUTA PARA AVISO DE SUBIDA DE ARCHIVOS

@api.route('/blog', methods=['POST'])
def remove_old_blogs():
    try:
        seven_days_ago = datetime.now() - timedelta(days=7)
        old_blogs = Blog.query.filter(Blog.date <= seven_days_ago).all()
        for blog in old_blogs:
            db.session.delete(blog)
        db.session.commit()
        return jsonify({'message': 'Las actualizaciones se borraron correctamente'}), 200
    except Exception as error:
        return jsonify({'error': str(error)}), 500