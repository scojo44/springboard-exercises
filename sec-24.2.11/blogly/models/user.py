from . import db
from .helper import DBHelperMixin

DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/icon-user-blue-symbol-people-person-generic--public-domain--21.png"

class User(DBHelperMixin, db.Model):
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