   
import os
from flask_admin import Admin
from .models import db, Roomie, Home, Expenses, Debts, List, Item, Task, File, Blog
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Roomie, db.session))
    admin.add_view(ModelView(Home, db.session))
    admin.add_view(ModelView(Expenses, db.session))
    admin.add_view(ModelView(Debts, db.session))
    admin.add_view(ModelView(List, db.session))
    admin.add_view(ModelView(Item, db.session))
    admin.add_view(ModelView(Task, db.session))
    admin.add_view(ModelView(File, db.session))
    admin.add_view(ModelView(Blog, db.session))


    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))