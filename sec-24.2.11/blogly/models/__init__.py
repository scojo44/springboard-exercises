from flask_sqlalchemy import SQLAlchemy
from .base import Base

db = SQLAlchemy(model_class=Base)

# Import models after setting up database connection
from .user import User, DEFAULT_IMAGE_URL
from .post import Post
