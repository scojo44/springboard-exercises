"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/icon-user-blue-symbol-people-person-generic--public-domain--21.png"

def connect_db(app):
    """Connect to database."""
    db.app = app
    db.init_app(app)
    db.create_all()

class User(db.Model):
    """User model class."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30))
    image_url = db.Column(db.String(200), default=DEFAULT_IMAGE_URL)
    last_error = None
    
    @property
    def full_name(self):
        """Returns the user's full name."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        """Return a nicer description of User"""
        return f"<User #{self.id}: {self.first_name} {self.last_name} {self.image_url}>"
    
    def save(self):
        """Save the user to the database.  Returns whether the save was successful.
        When False, find out what happened with get_last_error()."""
        db.session.add(self)
        try:
            db.session.commit()
            return True
        except Exception as error:
            db.session.rollback()
            self.last_error = error
            return False
        
    def delete(self):
        """Delete a user from the database.  Returns whether the delete was successful.
        When False, find out what happened with get_last_error()."""
        User.query.filter_by(id=self.id).delete()
        try:
            db.session.commit()
            return True
        except Exception as error:
            db.session.rollback()
            self.last_error = error
            return False

    def get_last_error(self):
        """Call to get error details after a failure in save() or delete()."""
        error = self.last_error
        self.last_error = None
        return error