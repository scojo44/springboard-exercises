from . import db
from .helper import DBHelperMixin

#######################################
class Pet(DBHelperMixin, db.Model):
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