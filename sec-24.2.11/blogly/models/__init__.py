from typing import Annotated
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, registry

str30 = Annotated[str, 30]
str100 = Annotated[str, 100]
str200 = Annotated[str, 200]

class Base(DeclarativeBase):
    registry = registry(
        type_annotation_map={
            str30: String(30),
            str100: String(100),
            str200: String(200)
        }
    )

db = SQLAlchemy(model_class=Base)

# Import models after setting up database connection
from .user import User, DEFAULT_IMAGE_URL
from .post import Post
