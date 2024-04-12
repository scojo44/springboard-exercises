"""Flask Feedback Models"""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Import models after setting up database connection
from .user import User
from .feedback import Feedback
