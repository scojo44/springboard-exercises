from sqlalchemy.orm import Mapped, mapped_column
from .helper import DBHelperMixin
from . import db, str30, str200

DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/icon-user-blue-symbol-people-person-generic--public-domain--21.png"

class User(DBHelperMixin, db.Model):
    """Model of a Blogly user."""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str30]
    last_name: Mapped[str30]
    image_url: Mapped[str200] = mapped_column(default=DEFAULT_IMAGE_URL)

    posts: Mapped[list["Post"]] = db.relationship(back_populates="user", cascade="all, delete-orphan")

    @property
    def full_name(self):
        """Returns the user's full name."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        """Return a nicer description of User"""
        return f"<User #{self.id}: {self.first_name} {self.last_name} {self.image_url}>"
