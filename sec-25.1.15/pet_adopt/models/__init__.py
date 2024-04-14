from typing_extensions import Annotated
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, registry

# Aliases for length-limited strings
str30 = Annotated[str, 30]

class Base(DeclarativeBase):
    registry = registry(
        type_annotation_map={
            str30: String(30)
        }
    )

db = SQLAlchemy(model_class=Base)
known_species = ["cat", "dog", "horse", "bird", "fish", "porcupine"]

# Import models after setting up database connection
from .pet import Pet
