"""Flask Feedback Models"""
from typing import Annotated
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Aliases for length-limited strings
str20 = Annotated[str, 20]
str50 = Annotated[str, 50]
hashed_password = Annotated[str, 60]

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Import models after setting up database connection
from .user import User
from .feedback import Feedback
