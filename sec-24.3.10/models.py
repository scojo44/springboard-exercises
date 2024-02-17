"""Models for Blogly."""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/icon-user-blue-symbol-people-person-generic--public-domain--21.png"

##################################################
class BaseModel(DeclarativeBase):
    """Common database methods.  Only make instances with subclasses."""
    def save(self):
        """Save the model instance to the database.  Returns whether the save was successful.
        When False, find out what happened with get_last_error()."""
        try:
            db.session.add(self)
            db.session.commit()
            return True
        except Exception as error:
            db.session.rollback()
            self.last_error = error
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
            self.last_error = error
            return False

    last_error = None

    def get_last_error(self):
        """Call to get error details after a failure in save() or delete()."""
        error = self.last_error
        self.last_error = None
        return error

##################################################
db = SQLAlchemy(model_class=BaseModel)

def connect_db(app):
    """Connect to database."""
    db.init_app(app)
    with app.app_context():
        db.create_all()

##################################################
class User(db.Model):
    """Model of a Blogly user."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    image_url = db.Column(db.String(200), nullable=False, default=DEFAULT_IMAGE_URL)

    posts = db.relationship("Post", back_populates="user", cascade="all, delete")

    @property
    def full_name(self):
        """Returns the user's full name."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        """Return a nicer description of User"""
        return f"<User #{self.id}: {self.first_name} {self.last_name} {self.image_url}>"

##################################################
class Post(db.Model):
    """Model of a Blogly posting."""
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

    user = db.relationship("User", back_populates="posts")
    tags = db.relationship("Tag", back_populates="posts", secondary="posts_tags")

    @property
    def friendly_date(self):
        """Returns a nicer timestamp name."""
        return self.created_at.strftime("%B %-d, %Y, %-I:%M %p")

    def __repr__(self):
        """Return a nicer description of Post"""
        return f"<Post #{self.id}: {self.title[:50]} {self.content[:50]} {self.created_at}>"

##################################################
class Tag(db.Model):
    """Model of a tag"""
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(30), nullable=False, unique=True)

    posts = db.relationship("Post", back_populates="tags", secondary="posts_tags")

    def __repr__(self):
        """Return a nicer description of Tag"""
        return f"<Tag #{self.id}: {self.name}>"

##################################################
class PostTag(db.Model):
    """Model for joining posts and tags."""
    __tablename__ = "posts_tags"

    post = db.Column(db.Integer, db.ForeignKey(Post.id), primary_key=True)
    tag = db.Column(db.Integer, db.ForeignKey(Tag.id), primary_key=True)