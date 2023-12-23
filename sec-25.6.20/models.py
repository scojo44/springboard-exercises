"""Models for Flask Feedback"""
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def connect_db(app):
    db.app = app
    db.init_app(app)
    db.create_all()

#######################################
class BaseModel(db.Model):
    """Common database methods.  Only make instances with subclasses."""

    # This line tells SQLAlchemy to not treat this base class as another model.
    # https://stackoverflow.com/questions/9606551/sqlalchemy-avoiding-multiple-inheritance-and-having-abstract-base-class
    __abstract__ = True

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
class User(BaseModel):
    """Model of a user of the app"""
    __tablename__ = "users"

    @classmethod
    def register(cls, username, password, email, first, last, is_admin=False):
        """Register new user with hashed password and return the user."""
        # Return False if user exists
        if User.query.filter_by(username=username).first():
            raise Exception("That username is already taken.")

        hash = bcrypt.generate_password_hash(password).decode("utf8")
        return cls(username=username, password=hash, email=email, first_name=first, last_name=last, is_admin=is_admin)

    @classmethod
    def authenticate(cls, username, password):
        """Make sure that the user exists and password is correct.
        
        Returns the authenticated user or False.
        """
        user = User.query.filter_by(username=username).first()

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
class Feedback(BaseModel):
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
