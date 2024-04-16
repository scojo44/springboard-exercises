"""Flask Feedback Models"""
from typing import Annotated
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, registry

# Aliases for length-limited strings
str20 = Annotated[str, 20]
str50 = Annotated[str, 50]
hashed_password = Annotated[str, 60]

class Base(DeclarativeBase):
    registry = registry(
        type_annotation_map={
            str20: String(20),
            str50: String(50),
            hashed_password: String(60)
        }
    )

db = SQLAlchemy(model_class=Base)

# Import models after setting up database connection
from .user import User
from .feedback import Feedback
