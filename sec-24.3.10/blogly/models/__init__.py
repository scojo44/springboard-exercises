import sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Import models after setting up database connection
from .user import User, DEFAULT_IMAGE_URL
from .post import Post
from .tag import Tag

# Many-to-Many association table for Post and Tag
post_tag = db.Table("posts_tags",
    sqlalchemy.Column("post", sqlalchemy.ForeignKey(Post.id), primary_key=True),
    sqlalchemy.Column("tag", sqlalchemy.ForeignKey(Tag.id), primary_key=True)
)
