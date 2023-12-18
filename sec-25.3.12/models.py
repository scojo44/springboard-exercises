"""Models for Cupcake app."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""
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
class Cupcake(BaseModel):
    """Model as a yummy cupcake."""
    __tablename__ = "cupcakes"
    GENERIC_CUPCAKE_IMAGE = "https://tinyurl.com/demo-cupcake"

    id     = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.String(30), nullable=False)
    size   = db.Column(db.String(30), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image  = db.Column(db.Text, nullable=False, default=GENERIC_CUPCAKE_IMAGE)

    def serialize(self):
        return {
            "id": self.id,
            "flavor": self.flavor,
            "size": self.size,
            "rating": self.rating,
            "image": self.image
        }