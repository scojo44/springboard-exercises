"""Models for Flask Feedback"""
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

bcrypt = Bcrypt()

#######################################
class BaseModel(DeclarativeBase):
    """Common database methods.  Only make instances with subclasses."""
    @classmethod
    def get(cls, primary_key):
        """Return one instance of a model using the primary key or None if it doesn't exist."""
        return db.session.get(cls, primary_key)

    @classmethod
    def get_or_404(cls, primary_key):
        """Return one instance of a model using the primary key or a 404 error if it doesn't exist."""
        return db.get_or_404(cls, primary_key, description=f"{cls.__name__} {primary_key} doesn't exist.")

    @classmethod
    def get_first(cls, select = None):
        """Return the first of several instances of a model."""
        if select is None:
            select = db.select(cls)
        return db.session.scalars(select).first()

    @classmethod
    def get_all(cls, select = None):
        """Return all instances of a model."""
        if select is None:
            select = db.select(cls)
        return db.session.scalars(select).all()

    def save(self):
        """Save the model instance to the database.  Returns whether the save was successful.
        When False, find out what happened with get_last_error()."""
        db.session.add(self)
        try:
            db.session.commit()
            return True
        except Exception as error:
            db.session.rollback()
            self.last_error = error.args[0]
            return False
    
    def delete(self):
        """Delete a model instance from the database.  Returns whether the delete was successful.
        When False, find out what happened with get_last_error()."""
        try:
            db.session.delete(self)
            db.session.commit()
            return True
        except Exception as error:
            db.session.rollback()
            self.last_error = error.args[0]
            return False
        
    last_error = None

    def get_last_error(self):
        """Call to get error details after a failure in save() or delete()."""
        error = self.last_error
        self.last_error = None
        return error

#######################################
db = SQLAlchemy(model_class=BaseModel)

def connect_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

#######################################
class User(db.Model):
    """Model of a user of the app"""
    __tablename__ = "users"

    @classmethod
    def register(cls, username, password, email, first, last, is_admin=False):
        """Register new user with hashed password and return the user."""
        # Return False if user exists
        if User.get(username):
            raise Exception("That username is already taken.")

        hash = bcrypt.generate_password_hash(password).decode("utf8")
        return cls(username=username, password=hash, email=email, first_name=first, last_name=last, is_admin=is_admin)

    @classmethod
    def authenticate(cls, username, password):
        """Make sure that the user exists and password is correct.
        
        Returns the authenticated user or False.
        """
        user = User.get(username)

        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False

    username = db.Column(db.String(20), primary_key=True)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)

    feedback = db.relationship("Feedback", back_populates="user", cascade="all, delete")

    @property
    def full_name(self):
        """Returns the user's full name."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        """Return a nicer description of User"""
        return f"<User {self.username}: {self.first_name} {self.last_name} - {self.email}>"

#######################################
class Feedback(db.Model):
    """Model of a feedback of the app"""
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(20), db.ForeignKey("users.username"), nullable=False)

    user = db.relationship("User", back_populates="feedback")

    def __repr__(self):
        """Return a nicer description of Post"""
        return f"<Feedback #{self.id}: {self.title[:50]} - {self.content[:50]}>"
