"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Roomie, Home, Expenses, Debts, List, Item, Task, File, Blog, Notifications
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime, timedelta
from api.custom_bcrypt import bcrypt

api = Blueprint('api', __name__)

#Ruta para creación de token
@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    roomie = Roomie.query.filter_by(email=email).first()
    if roomie is None or not bcrypt.check_password_hash(roomie.password, password):
        return jsonify({'message': 'El email o la contraseña no son correctos'}), 401
    access_token = create_access_token(identity={'roomie_id': roomie.id, 'is_admin': roomie.is_admin})
    return jsonify({'token': access_token, 'roomie_id': roomie.id, 'is_admin': roomie.is_admin})


#Ruta para registrar nuevo roomie
@api.route('/signup', methods=['POST'])
def create_roomie():
    data = request.get_json()
    required_fields = ['email', 'password', 'first_name', 'phone_number']
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
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_roomie = Roomie(
        email=email,
        password=hashed_password,
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
    if not roomie:
        return jsonify({'error': 'El email o la contraseña no son correctos'}), 401
    if not bcrypt.check_password_hash(roomie.password, password):
        return jsonify({'error': 'El email o la contraseña no son correctos'}), 401
    return create_token()


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

@api.route('/roomie/home/<int:home_id>', methods=['GET'])
def get_roomies_by_home_id(home_id):
    roomies = Roomie.query.filter_by(home_id=home_id).all()
    roomie_list = [roomie.serialize() for roomie in roomies]
    return jsonify(roomie_list), 200

@api.route('/roomie/<int:roomie_id>', methods=['PUT'])
def updated_roomie(roomie_id):
    request_body_roomie = request.get_json()
    chosen_roomie = Roomie.query.get(roomie_id)
    if chosen_roomie is None:
        return jsonify({'error': 'Este roomie no existe'}), 404
    if 'email' in request_body_roomie or 'phone_number' in request_body_roomie:
        return jsonify({'error': 'No puedes actualizar el email o el número de teléfono'}), 400
    if 'password' in request_body_roomie:
        chosen_roomie.password = request_body_roomie['password']
    if 'first_name' in request_body_roomie:
        chosen_roomie.first_name = request_body_roomie['first_name']
    if 'last_name' in request_body_roomie:
        chosen_roomie.last_name = request_body_roomie['last_name']
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
    roomie_id = get_jwt_identity().get('roomie_id')
    is_admin = get_jwt_identity().get('is_admin')
    name = request_body_home['name']
    new_home = Home(name=name, is_active=True)
    roomie = Roomie.query.get(roomie_id)
    if roomie:
        new_home.roomies.append(roomie)
    shopping_list_name = f"Shopping List de {name}"
    shopping_list = List(name=shopping_list_name)
    new_home.shopping_list = shopping_list
    db.session.add(new_home)
    db.session.commit()
    if roomie and not is_admin:
        roomie.is_admin = True
        db.session.commit()
        updated_access_token = create_access_token(identity={
            'roomie_id': roomie_id,
            'is_admin': True
        })
    else:
        updated_access_token = create_access_token(identity={
            'roomie_id': roomie_id,
            'is_admin': is_admin
        })
    return jsonify({'message': 'Vivienda creada correctamente', 'access_token': updated_access_token, 'roomie_id': roomie.id, 'is_admin': roomie.is_admin, 'shopping_list_name': shopping_list_name}), 200

@api.route('/home/<int:home_id>', methods=['POST'])
@jwt_required()
def add_roomie_to_home_by_email(home_id):
    home = Home.query.get(home_id)
    if home is None:
        return jsonify({'error': 'Esta vivienda no existe'}), 404
    current_roomie_id = get_jwt_identity().get('roomie_id')
    is_admin = get_jwt_identity().get('is_admin')
    if not is_admin:
        return jsonify({'error': 'No tienes permiso para añadir roomies a esta vivienda o no eres un administrador'}), 403
    request_data = request.get_json()
    roomie_email = request_data.get('email')
    if roomie_email is None:
        return jsonify({'error': 'Es necesario proporcionar el correo electrónico del roomie'}), 400
    roomie = Roomie.query.filter_by(email=roomie_email).first()
    if roomie is None:
        return jsonify({'error': 'No se encontró el roomie con el correo electrónico proporcionado'}), 400
    if roomie in home.roomies:
        return jsonify({'error': 'Este roomie ya está en la vivienda'}), 400
    home.roomies.append(roomie)
    current_roomie = Roomie.query.filter_by(id=current_roomie_id).first()
    new_blog = Blog(
        home_id=home.id,
        text=f'Nuevo roomie añadido: {roomie.first_name}',
        roomie_name=current_roomie.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Roomie añadido a la vivienda correctamente'}), 200

@api.route('/home/<int:home_id>/<int:roomie_id>', methods=['DELETE'])
@jwt_required()
def delete_roomie_from_home(home_id, roomie_id):
    current_roomie_id = get_jwt_identity().get('roomie_id')
    current_roomie_is_admin = get_jwt_identity().get('is_admin')
    home = Home.query.get(home_id)
    if not home:
        return jsonify({'error': 'Esta vivienda no existe'}), 404
    if not current_roomie_is_admin:
        return jsonify({'error': 'No tienes permiso para eliminar a este roomie o no eres un administrador'}), 403
    roomie = Roomie.query.get(roomie_id)
    if not roomie or roomie not in home.roomies:
        return jsonify({'error': 'El roomie no pertenece a esta vivienda'}), 400
    roomie.home_id = None
    current_roomie = Roomie.query.filter_by(id=current_roomie_id).first()
    new_blog = Blog(
        home_id=home.id,
        text=f'Roomie eliminado: {roomie.first_name}',
        roomie_name=current_roomie.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Roomie eliminado de la vivienda correctamente'}), 200

@api.route('/home/<int:home_id>', methods=['PUT'])
def inactive_home(home_id):
    chosen_home = Home.query.get(home_id)
    if chosen_home is None:
        return jsonify({'error': 'Esta vivienda no existe'}), 404
    if chosen_home.shopping_list:
        db.session.delete(chosen_home.shopping_list)
    roomies_in_home = Roomie.query.filter_by(home_id=home_id).all()
    for roomie in roomies_in_home:
        roomie.home_id = None
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

@api.route('/task/roomie/<int:roomie_id>', methods=['GET'])
def get_tasks_by_roomie_id(roomie_id):
    tasks = Task.query.filter_by(roomie_id=roomie_id).all()
    task_list = [task.serialize() for task in tasks]
    return jsonify(task_list), 200

@api.route('/task', methods=['POST'])
def create_task():
    request_data = request.get_json()
    roomie_id = request_data.get('roomie_id')
    name = request_data.get('name')
    date_assigned_str = request_data.get('date_assigned')
    roomie_id = request_data.get('roomie_id', None)
    date_done = request_data.get('date_done', None)
    if roomie_id is None or name is None or date_assigned_str is None:
        return jsonify({'error': 'Faltan campos por completar'}), 400
    try:
        date_assigned = datetime.strptime(date_assigned_str, '%d-%m-%Y')
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido. Utilice el formato DD-MM-YYYY'}), 400
    roomie = Roomie.query.get(roomie_id)
    if roomie is None:
        return jsonify({'error': 'No se encontró al roomie con el ID proporcionado'}), 404
    new_task = Task(
        name=name,
        date_assigned=date_assigned,
        date_done=date_done,
        roomie_id=roomie_id
    )
    db.session.add(new_task)
    text = f"Nueva tarea asignada: {new_task.name}"
    if roomie.home:
        new_blog = Blog(
            home_id=roomie.home.id,
            text=text,
            roomie_name=roomie.first_name,
            date=date_assigned,
            status='Pendiente',
        )
        db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Nueva tarea añadida correctamente'}), 200

@api.route('/task/<int:task_id>', methods=['PUT'])
def mark_task_as_done(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return jsonify({'error': 'La tarea no existe'}), 404
    if task.date_done:
        return jsonify({'message': 'La tarea ya está marcada como completada'}), 200
    task.date_done = datetime.now()
    text = f"Tarea completada: {task.name}"
    new_blog = Blog(
        home_id=task.roomie.home.id,
        text=text,
        roomie_name=task.roomie.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Tarea completada'}), 200

@api.route('/task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return jsonify({'error': 'La tarea no existe'}), 400
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Tarea eliminada correctamente'}), 200


#Rutas para lista de la compra
@api.route('/list', methods=['GET'])
def get_all_list():
    shopping_lists = List.query.all()
    all_lists = list(map(lambda item: item.serialize(), shopping_lists))
    if not all_lists:
         return jsonify({'error': 'No hay listas de la compra registradas'}), 404
    return jsonify(all_lists), 200

@api.route('/list/home/<int:home_id>', methods=['GET'])
def get_list_by_home(home_id):
    shopping_lists = List.query.filter_by(home_id=home_id).all()
    if not shopping_lists:
        return jsonify({'error': 'No hay lista de la compra para esta vivienda'}), 404
    serialized_shopping_lists = [shopping_list.serialize() for shopping_list in shopping_lists]
    return jsonify(serialized_shopping_lists), 200


#Rutas para elementos de la lista de la compra
@api.route('/item', methods=['GET'])
def get_all_items():
    items= Item.query.all()
    all_items = list(map(lambda item: item.serialize(), items))
    if all_items == []:
         return jsonify({'error': 'No hay elementos registrados'}), 404
    return jsonify(all_items), 200

@api.route('/item/<int:item_id>', methods=['GET'])
def get_one_item(item_id):
    chosen_item = Item.query.filter_by(id=item_id).first()
    if chosen_item is None:
        return jsonify({'error': 'Este elemento no existe'}), 404
    return jsonify(chosen_item.serialize()), 200

@api.route('/item/list/<int:list_id>', methods=['GET'])
def get_items_by_list_id(list_id):
    items = Item.query.filter_by(shopping_list_id=list_id).all()
    items_list = [item.serialize() for item in items]
    return jsonify(items_list), 200

@api.route('/item', methods=['POST'])
@jwt_required()
def create_item():
    request_data = request.get_json()
    name = request_data.get('name')
    shopping_list_id = request_data.get('shopping_list_id')
    if name is None or shopping_list_id is None:
        return jsonify({'error': 'Faltan campos por completar'}), 400
    shopping_list = List.query.get(shopping_list_id)
    if shopping_list is None:
        return jsonify({'error': 'Lista de la compra no encontrada'}), 400
    current_roomie_id = get_jwt_identity().get('roomie_id')
    new_item = Item(
        name=name,
        shopping_list_id=shopping_list.id,
        expense_id=None
    )
    db.session.add(new_item)
    current_roomie = Roomie.query.filter_by(id=current_roomie_id).first()
    new_blog = Blog(
        home_id=shopping_list.home.id,
        text=f'Nuevo elemento agregado a la lista: {new_item.name}',
        roomie_name=current_roomie.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Nuevo elemento añadido correctamente'}), 200

@api.route('/item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = Item.query.get(item_id)
    if item is None:
        return jsonify({'error': 'El elemento no existe'}), 400
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Elemento eliminado correctamente'}), 200


#Rutas para archivos
@api.route('/file', methods=['GET'])
def get_all_files():
    files= File.query.all()
    all_files = list(map(lambda item: item.serialize(), files))
    if all_files == []:
         return jsonify({'error': 'No hay archivos registrados'}), 404
    return jsonify(all_files), 200

@api.route('/file/<int:file_id>', methods=['GET'])
def get_one_file(file_id):
    chosen_file = File.query.filter_by(id=file_id).first()
    if chosen_file is None:
        return jsonify({'error': 'Este archivo no existe'}), 404
    return jsonify(chosen_file.serialize()), 200

@api.route('/file/home/<int:home_id>', methods=['GET'])
def get_files_by_home_id(home_id):
    files = File.query.filter_by(home_id=home_id).all()
    files_list = [item.serialize() for item in files]
    return jsonify(files_list), 200

#PENDIENTE DE CREAR RUTA PARA SUBIR ARCHIVOS USANDO CLOUDINARY


#Rutas para noticias
@api.route('/blog', methods=['GET'])
def get_all_blogs():
    blogs= Blog.query.all()
    all_blogs = list(map(lambda item: item.serialize(), blogs))
    if all_blogs == []:
         return jsonify({'error': 'No hay actualizaciones registradas'}), 400
    return jsonify(all_blogs), 200

@api.route('/blog/home/<int:home_id>', methods=['GET'])
def get_blogs_by_home(home_id):
    blogs = Blog.query.filter_by(home_id=home_id).all()
    if not blogs:
        return jsonify({'error': 'No hay actualizaciones para esta vivienda'}), 400
    serialized_blogs = [blog.serialize() for blog in blogs]
    return jsonify(serialized_blogs), 200

#PENDIENTE DE CREAR CODIGO CORRECTO PARA ESTA RUTA
@api.route('blog/debts/<int:debt_id>', methods=['POST'])
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

#PENDIENTE PROBAR ESTA RUTA
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