from . import db
from .helper import DBHelperMixin

class Cupcake(DBHelperMixin, db.Model):
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
