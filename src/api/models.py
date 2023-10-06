from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Roomie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)
    first_name = db.Column(db.String(20))
    last_name = db.Column(db.String(20))
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    avatar = db.Column(db.String(200))
    paypal_id = db.Column(db.String(12))
    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=True)

    tasks = db.relationship('Task', backref='roomie')
    notifications = db.relationship('Notifications', backref='roomie')
    
    def __repr__(self):
        return '<Roomie %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "avatar": self.avatar,
            "admin": self.is_admin,
            "home_id": self.home_id
        }

class Home(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)

    roomies = db.relationship('Roomie', backref='home')
    expenses = db.relationship('Expenses', backref='home')
    shopping_list = db.relationship('List', backref='home', lazy=True, uselist=False)
    files = db.relationship('File', backref='home')
    blogs = db.relationship('Blog', backref='home')
    
    def __repr__(self):
        return '<Home %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_active": self.is_active
        }

class Expenses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)

    roomie_debts = db.relationship('Debts', backref='expense')
    shopping_items = db.relationship('Item', backref='expense', lazy=True)
    file = db.relationship('File', backref='expense', lazy=True, uselist=False)

    def __repr__(self):
        return '<Expenses %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "home_id": self.home_id
        }

class Debts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, nullable=False)
    roomie_debtor_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), nullable=False)
    roomie_paying_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)

    roomie_debtor = db.relationship('Roomie', foreign_keys=[roomie_debtor_id])
    roomie_paying = db.relationship('Roomie', foreign_keys=[roomie_paying_id])

    def __repr__(self):
        return '<Debts %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "roomie_debtor_id": self.roomie_debtor_id,
            "roomie_paying_id": self.roomie_paying_id,
            "status": self.status,
            "date": str(self.date),
            "expense_id": self.expense_id
        }

class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)
    
    shopping_items = db.relationship('Item', backref='list')

    def __repr__(self):
        return '<List %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "home_id": self.home_id
        }

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    shopping_list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'))
    
    def __repr__(self):
        return '<Item %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "shopping_list_id": self.shopping_list_id,
            "expense_id": self.expense_id
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    date_assigned = db.Column(db.Date, nullable=False)
    date_done = db.Column(db.Date, nullable=True)
    roomie_id = db.Column(db.Integer, db.ForeignKey('roomie.id'),nullable=False)

    def __repr__(self):
        return '<Task %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date_assigned": str(self.date_assigned),
            "date_done": str(self.date_done),
            "roomie_id": self.roomie_id
        }

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    upload_date = db.Column(db.Date)
    url = db.Column(db.String(200))
    home_id = db.Column(db.Integer, db.ForeignKey('home.id'))
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'))

    def __repr__(self):
        return '<File %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "upload_date": str(self.upload_date),
            "url": self.url,
            "home_id": self.home_id,
            "expense_id": self.expense_id,
        }

class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)

    def __repr__(self):
        return '<Blog %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "status": self.status,
            "amount": self.amount,
            "date": str(self.date),
            "home_id": self.home_id,
        }

class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), db.ForeignKey('roomie.phone_number'), nullable=False)

    def __repr__(self):
        return '<Notifications %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone_number": self.phone_number,
        }