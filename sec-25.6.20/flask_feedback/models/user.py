"""User Model"""
from sqlalchemy.orm import Mapped, mapped_column
from ..extensions import bcrypt
from .helper import DBHelperMixin
from . import db, str20, str50, hashed_password

class User(DBHelperMixin, db.Model):
    """Model of a user of the app"""
    __tablename__ = "users"

    @classmethod
    def register(cls, username, password, email, first, last, is_admin=False):
        """Register new user with hashed password and return the user."""
        # Return False if user exists
        if User.get(username):
            raise Exception("That username is already taken.")

        hash = bcrypt.generate_password_hash(password).decode("utf8")
        return cls(username=username, password=hash, email=email, first_name=first, last_name=last, is_admin=is_admin)

    @classmethod
    def authenticate(cls, username, password):
        """Make sure that the user exists and password is correct.
        
        Returns the authenticated user or False.
        """
        user = User.get(username)

        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False

    username: Mapped[str20] = mapped_column(primary_key=True)
    password: Mapped[hashed_password]
    email: Mapped[str50] = mapped_column(unique=True)
    first_name: Mapped[str50]
    last_name: Mapped[str50]
    is_admin: Mapped[bool] = mapped_column(default=False)

    feedback: Mapped[list["Feedback"]] = db.relationship(back_populates="user", cascade="all, delete")

    @property
    def full_name(self):
        """Returns the user's full name."""
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        """Return a nicer description of User"""
        return f"<User {self.username}: {self.first_name} {self.last_name} - {self.email}>"
