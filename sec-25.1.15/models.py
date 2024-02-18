from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

known_species = ["cat", "dog", "horse", "bird", "fish", "porcupine"]

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

#######################################
db = SQLAlchemy(model_class=BaseModel)

def connect_db(app):
    """Connect to database."""
    db.init_app(app)
    with app.app_context():
        db.create_all()

#######################################
class Pet(db.Model):
    """Model of a lovable pet waiting to be adopted."""
    __tablename__ = "pets"
    GENERIC_PET_IMAGE = "https://mylostpetalert.com/wp-content/themes/mlpa-child/images/nophoto.gif"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(30), nullable=False)
    species = db.Column(db.String(30), nullable=False)
    photo_url = db.Column(db.Text)
    age = db.Column(db.Integer)
    notes = db.Column(db.Text)
    available = db.Column(db.Boolean, nullable=False, default=True)

    def __repr__(self):
        return f"<Pet #{self.id}: {self.name}, {self.species}, {self.age}, Available? {self.available}>"

    @property
    def image_url(self):
        """Return photo URL or a generic placeholder image."""
        return self.photo_url or self.GENERIC_PET_IMAGE