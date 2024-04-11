"""Flask Feedback Models"""
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
bcrypt = Bcrypt()

from .user import User
from .feedback import Feedback
