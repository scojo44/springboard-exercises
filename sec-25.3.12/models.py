"""Models for Cupcake app."""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

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
    """Connect to database."""
    db.init_app(app)
    with app.app_context():
        db.create_all()

#######################################
class Cupcake(db.Model):
    """Model of a yummy cupcake."""
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