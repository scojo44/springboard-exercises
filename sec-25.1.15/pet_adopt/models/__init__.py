from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from .base import Base

db = SQLAlchemy(model_class=Base)

known_species = ["cat", "dog", "horse", "bird", "fish", "porcupine"]
from .pet import Pet
