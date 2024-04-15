from typing import Annotated
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Aliases for length-limited strings
str30 = Annotated[str, 30]

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
known_species = ["cat", "dog", "horse", "bird", "fish", "porcupine"]

# Import models after setting up database connection
from .pet import Pet
