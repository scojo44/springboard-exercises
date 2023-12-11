"""Models for Blogly."""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/icon-user-blue-symbol-people-person-generic--public-domain--21.png"

def connect_db(app):
    """Connect to database."""
    db.app = app
    db.init_app(app)
    db.create_all()

##################################################
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
            self.last_error = error
            return False
        
    def delete(self, query):
        """Delete a model instance from the database.  Returns whether the delete was successful.
        When False, find out what happened with get_last_error()."""
        query.filter_by(id=self.id).delete()
        try:
            db.session.commit()
            return True
        except Exception as error:
            db.session.rollback()
            self.last_error = error
            return False

    last_error = None

    def get_last_error(self):
        """Call to get error details after a failure in save() or delete()."""
        error = self.last_error
        self.last_error = None
        return error

##################################################
class User(BaseModel):
    """Model of a Blogly user."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    image_url = db.Column(db.String(200), nullable=False, default=DEFAULT_IMAGE_URL)

    posts = db.relationship("Post", back_populates="user", cascade="all, delete-orphan")

    @property
    def full_name(self):
        """Returns the user's full name."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        """Return a nicer description of User"""
        return f"<User #{self.id}: {self.first_name} {self.last_name} {self.image_url}>"
    
    def delete(self):
        return super().delete(User.query)

##################################################
class Post(BaseModel):
    """Model of a Blogly posting."""
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="posts")

    @property
    def friendly_date(self):
        """Returns a nicer timestamp name."""
        return self.created_at.strftime("%B %-d, %Y, %-I:%M %p")

    def __repr__(self):
        """Return a nicer description of Post"""
        return f"<Post #{self.id}: {self.title[:50]} {self.content[:50]} {self.created_at}>"

    def delete(self):
        return super().delete(Post.query)
