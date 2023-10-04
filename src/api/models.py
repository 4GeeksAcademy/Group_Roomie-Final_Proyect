from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Roomie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    email = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(8), nullable=False)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    phone_number = db.Column(db.Integer, unique=True, nullable=False)
    avatar = db.Column(db.String(200), nullable=False)
    paypal_id = db.Column(db.String(12), nullable=False)

    #home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=True)

    tasks = db.relationship('Task', backref='roomie')
    #blogs = db.relationship('Blog', backref='roomie')
    #notification = db.relationship('Notifications', backref='roomie')
    #expenses = db.relationship('Expenses', secondary='debts', backref='roomie', lazy=True)
    
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
            #"home_id": self.home_id
        }

class Home(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True, default=True)
    
    #admin_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), nullable=False)

    #files = db.relationship('File', backref='home')
    #roomies = db.relationship('Roomie', backref='home')
    #expenses = db.relationship('Expenses', backref='home')
    #shopping_lists = db.relationship('List', backref='home')
    
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

    #home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)

    #roomie_debts = db.relationship('Debts', backref='expenses', lazy=True, overlaps="roomie")
    #shopping_items = db.relationship('Items', backref='expenses', lazy=True)
    #files = db.relationship('File', backref='expenses', lazy=True)

    def __repr__(self):
        return '<Expenses %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            #"home_id": self.home_id
        }

class Debts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, nullable=False)
    roomie_debtor = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, nullable=False)

    #roomie_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), nullable=False)
    #expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)

    def __repr__(self):
        return '<Debts %r>' % self.id

    def serialize(self):
        return {
            "id": self.id
            "amount": self.amount,
            "roomie_debtor": self.roomie_debtor,
            "status": self.status,
            "date": str(self.date),
            #"roomieID": self.roomie_id,
            #"expenseID": self.expense_id
            
        }

class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    #home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)
    
    #shopping_items = db.relationship('Items', backref='list', lazy=True)

    def __repr__(self):
        return '<List %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            #"home_id": self.home_id
        }

class Items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    checked = db.Column(db.Boolean, nullable=False)

    #shopping_list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    #expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)
    
    def __repr__(self):
        return '<Items %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "checked": self.checked,
            #"list_id": self.shopping_list_id,
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    date_added = db.Column(db.Date, nullable=False)
    date_done = db.Column(db.Date, nullable=False)

    roomie_id = db.Column(db.Integer, db.ForeignKey('roomie.id'),nullable=False)

    #roomie = db.relationship('Roomie', backref='task')

    def __repr__(self):
        return '<Task %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date_added": str(self.date_added),
            "date_done": str(self.date_done),
            "done": self.done,
            "roomie_id": self.roomie_id
        }

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    url = db.Column(db.String(200), nullable=False)

    #home_id = db.Column(db.Integer, db.ForeignKey('home.id'), nullable=False)
    #expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)

    def __repr__(self):
        return '<File %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": str(self.date),
            "url": self.url,
            #"home_id": self.home_id,
            #"expense_id": self.expense_id,
        }

class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)

    #roomie_id = db.Column(db.Integer, db.ForeignKey('roomie.id'), nullable=False)

    def __repr__(self):
        return '<Blog %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "amount": self.amount,
            "date": str(self.date),
            #"roomie_id": self.roomie_id,
        }

class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)

    #phone_number = db.Column(db.Integer, db.ForeignKey('roomie.phone_number'), nullable=False)

    def __repr__(self):
        return '<Notifications %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            #"phone_number": self.phone_number,
        }