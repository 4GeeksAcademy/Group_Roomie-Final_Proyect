from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Roomie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_admin = db.Column(db.Boolean, nullable=False)
    email = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(8), nullable=False)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    phone_number = db.Column(db.Integer, unique=True, nullable=False)
    avatar = db.Column(db.String(200), nullable=False)
    paypal_id = db.Column(db.String(12), nullable=False)

    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)

    expenses = db.relationship('Expenses', secondary='roomie_debts', backref='roomie', lazy=True)
    tasks = db.relationship('Task', backref='roomie')
    blogs = db.relationship('Blog', backref='roomie')
    notification = db.relationship('Notifications', backref='roomie')

    def __repr__(self):
        return '<Roomie %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "avatar": self.avatar,
            "admin": self.is_admin,
        }

class Home(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    
    expenses = db.relationship('Expenses', backref='home', lazy=True)
    shopping_lists = db.relationship('ShoppingList', backref='home', lazy=True)
    files = db.relationship('File', backref='home', lazy=True)
    roomies = db.relationship('Roomie', backref='home', lazy=True)

    def __repr__(self):
        return '<Home %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Expenses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)
    
    roomie_debts = db.relationship('RoomieDebts', backref='expense', lazy=True, overlaps="roomie")
    shopping_items = db.relationship('ShoppingItems', backref='expenses', lazy=True)
    files = db.relationship('File', backref='expenses', lazy=True)
    
    def __repr__(self):
        return '<Expenses %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "home": self.home_id
        }

class RoomieDebts(db.Model):
    roomie_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), primary_key=True)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), primary_key=True)
    amount = db.Column(db.Integer, nullable=False)
    roomie_debtor = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return '<RoomieDebts %r>' % self.roomie_id

    def serialize(self):
        return {
            "expenseID": self.expense_id,
            "roomieID": self.roomie_id,
            "amount": self.amount,
            "roomieDebtor": self.roomie_debtor,
            "status": self.status,
            "date": str(self.date)
        }

class ShoppingList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)
    
    def __repr__(self):
        return '<ShoppingList %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "home_id": self.home_id,
            "name": self.name
        }

class ShoppingItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    checked = db.Column(db.Boolean, nullable=False)

    shopping_list_id = db.Column(db.Integer, db.ForeignKey('shopping_list.id'), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)

    def __repr__(self):
        return '<ShoppingItems %r>' % self.id

    def serialize(self):
        return {
            "itemID": self.id,
            "listID": self.shopping_list_id,
            "name": self.name,
            "checked": self.checked
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    date_added = db.Column(db.Date, nullable=False)
    date_done = db.Column(db.Date, nullable=False)
    done = db.Column(db.Boolean, nullable=False)

    roomie_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), nullable=False)

    def __repr__(self):
        return '<Task %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "roomie_id": self.roomie_id,
            "name": self.name,
            "date_added": str(self.date_added),
            "date_done": str(self.date_done),
            "done": self.done
        }

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    url = db.Column(db.String(200), nullable=False)

    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)

    def __repr__(self):
        return '<File %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "home": self.home_id,
            "expense": self.expense_id,
            "name": self.name,
            "date": str(self.date),
            "url": self.url
        }

class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    roomie_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), nullable=False)

    def __repr__(self):
        return '<Blog %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "roomie": self.roomie_id,
            "name": self.name,
            "status": self.status,
            "amount": self.amount,
            "date": str(self.date)
        }

class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)

    phone_number = db.Column(db.Integer, db.ForeignKey('roomie.phone_number'), nullable=False)

    def __repr__(self):
        return '<Notifications %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "phone_number": self.phone_number,
            "name": self.name
        }

