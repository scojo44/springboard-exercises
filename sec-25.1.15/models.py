from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""
    db.app = app
    db.init_app(app)
    db.create_all()

known_species = ["cat", "dog", "horse", "bird", "fish", "porcupine"]

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
class Pet(BaseModel):
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