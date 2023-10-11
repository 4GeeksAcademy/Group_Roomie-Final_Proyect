"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory, render_template
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, Roomie, Home, Expenses, Debts, List, Item, Task, File, Blog
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from datetime import datetime, timedelta
from api.custom_bcrypt import bcrypt
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler

#from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "supercontraseña"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)


# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response

#mail config
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'roomieconnectapp@gmail.com'
app.config['MAIL_PASSWORD'] = 'bqmaqtkkzdfqeegn'

mail = Mail(app)

def get_active_roomies_emails():
    with app.app_context():
        active_roomies = Roomie.query.filter_by(is_active=True).all()
        roomies_emails = [roomie.email for roomie in active_roomies]
    return roomies_emails

def send_daily_emails():
    with app.app_context():
        today = datetime.now()
        yesterday = today - timedelta(hours=24)
        new_blogs = Blog.query.filter(Blog.date <= today, Blog.date >= yesterday).all()
        if new_blogs:
            sample_blog = new_blogs[0]
            home_id = sample_blog.home_id
            roomies = Roomie.query.filter_by(home_id=home_id, is_active=True).all()
            roomies_emails = [roomie.email for roomie in roomies]
            msg = Message('¡Nuevas actualizaciones en RoomieConnect!', sender='roomieconnectapp@gmail.com', recipients=roomies_emails)
            msg.html = "<html><body><p>Estimado usuario de RoomieConnect,</p><p>Queremos informarte que hay nuevas actualizaciones importantes en tu vivienda. ¡No te pierdas las últimas novedades!</p><p>Puedes revisar todas las actualizaciones iniciando sesión en tu cuenta en RoomieConnect.</p><p>¡Gracias por ser parte de nuestra comunidad y por tu continuo apoyo!</p><p>Atentamente,</p><p>El equipo de RoomieConnect</p></body></html>"
            try:
                mail.send(msg)
            except Exception as error:
                print(str(error))
        else:
            print("No se encontraron nuevas entradas de blog hoy.")

scheduler = BackgroundScheduler()
scheduler.add_job(send_daily_emails, 'cron', hour=20, minute=30)
scheduler.start()


# Ejecuta la aplicación Flask
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
    
