"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Roomie, Home, Expenses, Debts, List, Item, Task, File, Blog
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
    access_token = create_access_token(identity={'roomie_id': roomie.id, 'is_admin': roomie.is_admin, 'home_id': roomie.home_id})
    return jsonify({'token': access_token, 'roomie_id': roomie.id, 'is_admin': roomie.is_admin, 'home_id': roomie.home_id})


#Ruta para registrar nuevo roomie
@api.route('/signup', methods=['POST'])
def create_roomie():
    data = request.get_json()
    required_fields = ['email', 'password', 'first_name']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta {field} en los campos del formulario'}), 400
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    avatar = data.get('avatar')
    paypal_id = data.get('paypal_id')
    existing_email_roomie = Roomie.query.filter_by(email=email).first()
    if existing_email_roomie:
        return jsonify({'error': 'Este roomie ya existe'}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_roomie = Roomie(
        email=email,
        password=hashed_password,
        first_name=first_name,
        last_name=last_name,
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


#Ruta para cerrar sesión
@api.route('/logout', methods=['POST'])
def logout_roomie():
    #Se limpia el local storage desde front
    response = jsonify({'message': 'El roomie ha salido correctamente'})
    return response


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
    if 'email' in request_body_roomie:
        return jsonify({'error': 'No puedes actualizar el email'}), 400
    if 'password' in request_body_roomie:
        chosen_roomie.password = request_body_roomie.get('password')
    if 'first_name' in request_body_roomie:
        chosen_roomie.first_name = request_body_roomie.get('first_name')
    if 'last_name' in request_body_roomie:
        chosen_roomie.last_name = request_body_roomie.get('last_name')
    if 'avatar' in request_body_roomie:
        chosen_roomie.avatar = request_body_roomie.get('avatar')
    if 'paypal_id' in request_body_roomie:
        chosen_roomie.paypal_id = request_body_roomie.get('paypal_id')
    db.session.commit()
    return jsonify(chosen_roomie.serialize()), 200

@api.route('/roomie/<int:roomie_id>', methods=['PUT'])
@jwt_required()
def inactivate_roomie(roomie_id):
    current_roomie_id = get_jwt_identity().get('roomie_id')
    roomie = Roomie.query.get(roomie_id)
    if roomie is None:
        return jsonify({'error': 'Roomie no encontrado'}), 404
    if roomie_id != current_roomie_id:
        return jsonify({'error': 'No tienes permiso para desactivar a este roomie'}), 403
    if roomie.home_id is not None:
        return jsonify({'error': 'No puedes desactivar a un roomie asociado a una vivienda'}), 403
    roomie.email = f'roomieeliminado{roomie.id}@roomieconnect.com'
    roomie.password = f'roomieeliminado{roomie.id}'
    roomie.first_name = f'roomieeliminado{roomie.id}'
    roomie.last_name = f'roomieeliminado{roomie.id}'
    roomie.avatar = f'roomieeliminado{roomie.id}'
    roomie.paypal_id = f'roomieeliminado{roomie.id}'
    roomie.is_active = False
    db.session.commit()
    return jsonify({'message': 'Roomie eliminado correctamente'}), 200


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
    shopping_list_name = f"Lista de la compra de {name}"
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
        text=f'Nuevo roomie agregado: {roomie.first_name}',
        roomie_name=current_roomie.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Roomie agregado a la vivienda correctamente'}), 200

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
    outstanding_debts = Debts.query.filter_by(roomie_debtor_id=roomie_id, status='Pendiente').all()
    if outstanding_debts:
        return jsonify({'error': 'El roomie tiene deudas pendientes y no puede ser eliminado'}), 400
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
@jwt_required()
def inactive_home(home_id):
    current_roomie_id = get_jwt_identity().get('roomie_id')
    current_roomie_is_admin = get_jwt_identity().get('is_admin')
    chosen_home = Home.query.get(home_id)
    if chosen_home is None:
        return jsonify({'error': 'Esta vivienda no existe'}), 404
    if not current_roomie_is_admin:
        return jsonify({'error': 'No tienes permiso para desactivar esta vivienda'}), 403
    roomies_in_home = Roomie.query.filter_by(home_id=home_id, is_admin=False).all()
    for roomie in roomies_in_home:
        roomie.home_id = None
    chosen_home.is_active = False
    if current_roomie_id in [roomie.id for roomie in roomies_in_home]:
        current_roomie = Roomie.query.get(current_roomie_id)
        current_roomie.home_id = None
        current_roomie.is_admin = False
    db.session.commit()
    return jsonify({'message': 'Vivienda desactivada correctamente'}), 200


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
            date=datetime.now(),
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

@api.route('/task/<int:task_id>', methods=['PUT'])
def update_task_date(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return jsonify({'error': 'La tarea no existe'}), 404
    request_data = request.get_json()
    new_date_assigned_str = request_data.get('new_date_assigned')
    if new_date_assigned_str is None:
        return jsonify({'error': 'Falta el campo new_date_assigned en el cuerpo de la solicitud'}), 400
    try:
        new_date_assigned = datetime.strptime(new_date_assigned_str, '%d-%m-%Y')
        roomie = Roomie.query.get(task.roomie_id)
        text = f'La fecha de la tarea "{task.name}" ha sido actualizada a {new_date_assigned_str}'
        new_blog = Blog(
            home_id=roomie.home.id,
            text=text,
            roomie_name=roomie.first_name,
            date=datetime.now(),
            status='Hecho',
        )
        task.date_assigned = new_date_assigned
        db.session.add(new_blog)
        db.session.commit()
        return jsonify({'message': 'Fecha de tarea actualizada correctamente'}), 200
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido. Utilice el formato DD-MM-YYYY'}), 400


@api.route('/task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task is None:
        return jsonify({'error': 'La tarea no existe'}), 400
    roomie = Roomie.query.get(task.roomie_id)
    if roomie is None:
        return jsonify({'error': 'No se encontró al roomie asociado a la tarea'}), 404
    task_name = task.name
    db.session.delete(task)
    db.session.commit()
    text = f"Tarea eliminada: {task_name}"
    if roomie.home:
        new_blog = Blog(
            home_id=roomie.home.id,
            text=text,
            roomie_name=roomie.first_name,
            date=datetime.now(),
            status='Hecho',
        )
        db.session.add(new_blog)
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
@jwt_required()
def delete_item(item_id):
    item = Item.query.get(item_id)
    if item is None:
        return jsonify({'error': 'El elemento no existe'}), 400
    home_id = item.shopping_list.home_id
    db.session.delete(item)
    db.session.commit()
    current_roomie_id = get_jwt_identity().get('roomie_id')
    current_roomie = Roomie.query.filter_by(id=current_roomie_id).first()
    if home_id:
        new_blog = Blog(
            home_id=home_id,
            text=f'Elemento eliminado por {current_roomie.first_name}: {item.name}',
            roomie_name=current_roomie.first_name,
            date=datetime.now(),
            status='Hecho',
        )
        db.session.add(new_blog)
        db.session.commit()
    return jsonify({'message': 'Elemento eliminado correctamente'}), 200


#Rutas para gastos
@api.route('/expense', methods=['GET'])
def get_all_expenses():
    expenses= Expenses.query.all()
    all_expenses = list(map(lambda item: item.serialize(), expenses))
    if all_expenses == []:
         return jsonify({'error': 'No hay gastos registrados'}), 404
    return jsonify(all_expenses), 200

@api.route('/expense/<int:expense_id>', methods=['GET'])
def get_one_expense(expense_id):
    chosen_expense = Expenses.query.filter_by(id=expense_id).first()
    if chosen_expense is None:
        return jsonify({'error': 'Este gasto no existe'}), 404
    return jsonify(chosen_expense.serialize()), 200

@api.route('/expense/home/<int:home_id>', methods=['GET'])
def get_expenses_by_home_id(home_id):
    expenses = Expenses.query.filter_by(home_id=home_id).all()
    expenses_list = [item.serialize() for item in expenses]
    return jsonify(expenses_list), 200

@api.route('/expense', methods=['POST'])
@jwt_required()
def create_expense():
    request_data = request.get_json()
    if not request_data or 'expense_name' not in request_data or 'item_ids' not in request_data:
        return jsonify({'error': 'Faltan campos por completar'}), 400
    item_ids = request_data.get('item_ids')
    for item_id in item_ids:
        item = Item.query.get(item_id)
        if item is None:
            return jsonify({'error': 'El elemento no existe'}), 404
        if item.expense_id is not None:
            return jsonify({'error': 'El elemento ya está marcado como comprado'}), 400
    expense_name = request_data.get('expense_name')
    current_roomie_id = get_jwt_identity().get('roomie_id')
    item = Item.query.get(item_ids[0])
    shopping_list = List.query.get(item.shopping_list_id)
    new_expense = Expenses(
        roomie_id=current_roomie_id,
        name=expense_name,
        home_id=shopping_list.home_id
    )
    db.session.add(new_expense)
    db.session.commit()
    for item_id in item_ids:
        item = Item.query.get(item_id)
        item.expense_id = new_expense.id
    db.session.commit()
    current_roomie = Roomie.query.filter_by(id=current_roomie_id).first()
    new_blog = Blog(
        home_id=shopping_list.home_id,
        text=f'{current_roomie.first_name} ha generado nuevo gasto por: {expense_name}',
        roomie_name=current_roomie.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Gasto generado'}), 200


#Rutas para deudas
@api.route('/debts', methods=['GET'])
def get_all_debts():
    debts= Debts.query.all()
    all_debts = list(map(lambda item: item.serialize(), debts))
    if all_debts == []:
         return jsonify({'error': 'No hay deudas registrados'}), 404
    return jsonify(all_debts), 200

@api.route('/debts/<int:debts_id>', methods=['GET'])
def get_one_debt(debts_id):
    chosen_debt = Debts.query.filter_by(id=debts_id).first()
    if chosen_debt is None:
        return jsonify({'error': 'Este gasto no existe'}), 404
    return jsonify(chosen_debt.serialize()), 200

@api.route('/debts', methods=['POST'])
@jwt_required()
def generate_debt():
    request_data = request.get_json()
    expense_id = request_data.get('expense_id')
    debtor_ids = request_data.get('debtor_ids')
    total_amount = request_data.get('total_amount')
    if not all([expense_id, debtor_ids, total_amount]):
        return jsonify({'error': 'Faltan campos por completar'}), 400
    current_roomie_id = get_jwt_identity().get('roomie_id')
    current_roomie = Roomie.query.filter_by(id=current_roomie_id).first()
    if current_roomie is None:
        return jsonify({'error': 'Roomie no encontrado'}), 404
    expense = Expenses.query.get(expense_id)
    if expense is None:
        return jsonify({'error': 'Gasto no encontrado'}), 404
    if expense.roomie_id != current_roomie_id:
        return jsonify({'error': 'No tienes permiso para crear esta deuda'})
    individual_debt_amount = total_amount / (len(debtor_ids) + 1)
    debts = []
    for debtor_id in debtor_ids:
        debtor_instance = Roomie.query.get(debtor_id)
        debt_text = f'{current_roomie.first_name} te debe {individual_debt_amount}€'
        debt = Debts(
            amount=individual_debt_amount,
            status='Pendiente',
            date=datetime.now().date(),
            roomie_debtor_id=debtor_id,
            roomie_paying_id=current_roomie_id,
            expense_id=expense.id
        )
        db.session.add(debt)
        debts.append(debt)
        new_blog = Blog(
            home_id=expense.home_id,
            text=debt_text,
            roomie_name=debtor_instance.first_name,
            date=datetime.now(),
            status='Hecho',
        )
        db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Deuda creada correctamente', 'debts': [debt.serialize() for debt in debts]}), 200

@api.route('/debts/<int:debt_id>', methods=['POST'])
@jwt_required()
def pay_debt(debt_id):
    current_roomie_id = get_jwt_identity().get('roomie_id')
    debt = Debts.query.get(debt_id)
    if debt is None:
        return jsonify({'error': 'Deuda no encontrada'}), 404
    if current_roomie_id != debt.roomie_debtor_id and current_roomie_id != debt.roomie_paying_id:
        return jsonify({'error': 'No tienes permiso para marcar esta deuda como pagada'}), 403
    if debt.status == 'Pagada':
        return jsonify({'message': 'La deuda ya está pagada'}), 200
    debt.status = 'Pagada'
    db.session.commit()
    payment_text = f'{debt.roomie_debtor.first_name} ha pagado {debt.amount} a {debt.roomie_paying.first_name}'
    new_blog = Blog(
        home_id=debt.expense.home_id,
        text=payment_text,
        roomie_name=debt.roomie_debtor.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Deuda pagada correctamente'}), 200


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

#CLOUDINARY SE USA DESDE FRONT PARA SUBIDA DE ARCHIVOS Y PREVISUALIZACION,
#NO NECESITA RUTA EN BACK

@api.route('/file', methods=['POST'])
@jwt_required()
def upload_file():
    request_data = request.get_json()
    file_name = request_data.get('name')
    file_url = request_data.get('url')
    home_id = request_data.get('home_id')
    expense_id = request_data.get('expense_id')
    if file_name is None or file_url is None or home_id is None:
        return jsonify({'error': 'Faltan campos por completar'}), 400
    current_roomie_id = get_jwt_identity().get('roomie_id')
    current_roomie = Roomie.query.filter_by(id=current_roomie_id).first()
    if current_roomie is None:
        return jsonify({'error': 'Roomie no encontrado'}), 404
    new_file = File(
        name=file_name,
        upload_date=datetime.now().date(),
        url=file_url,
        home_id=home_id,
        expense_id=expense_id
    )
    db.session.add(new_file)
    db.session.commit()
    blog_text = f'{current_roomie.first_name} ha subido un archivo: {file_name}'
    new_blog = Blog(
        home_id=home_id,
        text=blog_text,
        roomie_name=current_roomie.first_name,
        date=datetime.now(),
        status='Hecho',
    )
    db.session.add(new_blog)
    db.session.commit()
    return jsonify({'message': 'Archivo subido correctamente'}), 200

@api.route('/file/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    file = File.query.get(file_id)
    if file is None:
        return jsonify({'error': 'El archivo no existe'}), 400
    db.session.delete(file)
    db.session.commit()
    return jsonify({'message': 'Archivo eliminado correctamente'}), 200


#Rutas para noticias
@api.route('/blog', methods=['GET'])
def get_all_blogs():
    blogs = Blog.query.order_by(Blog.date.desc()).limit(20).all()
    if not blogs:
        return jsonify({'error': 'No hay actualizaciones registradas'}), 400
    all_blogs = [blog.serialize() for blog in blogs]
    return jsonify(all_blogs), 200

@api.route('/blog/home/<int:home_id>', methods=['GET'])
def get_blogs_by_home(home_id):
    blogs = Blog.query.filter_by(home_id=home_id).all()
    if not blogs:
        return jsonify({'error': 'No hay actualizaciones para esta vivienda'}), 400
    serialized_blogs = [blog.serialize() for blog in blogs]
    return jsonify(serialized_blogs), 200


#Rutas para calendario
@api.route('/calendar', methods=['GET'])
@jwt_required()
def calendar_view():
    current_roomie_id = get_jwt_identity().get('roomie_id')
    current_month = int(request.args.get('month'))
    all_debts = Debts.query.filter(
        (Debts.roomie_debtor_id == current_roomie_id) | (Debts.roomie_paying_id == current_roomie_id)
    ).all()
    all_tasks = Task.query.filter(Task.date_assigned.isnot(None)).all()
    calendar_data = []
    for debt in all_debts:
        if debt.date.month == current_month:
            if debt.roomie_debtor_id == current_roomie_id:
                title = f"Debes a {debt.roomie_paying.first_name}: {debt.amount} €"
            else:
                title = f"Pago de {debt.roomie_debtor.first_name}: {debt.amount} €"
            calendar_event = {
                "id": debt.id,
                "title": title,
                "start": debt.date.strftime('%d-%m-%Y'),
                "type": "debt"
            }
            calendar_data.append(calendar_event)
    for task in all_tasks:
        if task.date_assigned.month == current_month:
            calendar_event = {
                "id": task.id,
                "title": task.name,
                "start": task.date_assigned.strftime('%d-%m-%Y'),
                "end": task.date_done.strftime('%Y-%m-%d') if task.date_done else None,
                "type": "task"
            }
            calendar_data.append(calendar_event)
    return jsonify(calendar_data)

