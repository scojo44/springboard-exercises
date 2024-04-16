from typing import Annotated
from sqlalchemy import Column, ForeignKey, String
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, registry

str30 = Annotated[str, 30]
str100 = Annotated[str, 100]
str200 = Annotated[str, 200]

class Base(DeclarativeBase):
    registry = registry(
        type_annotation_map = {
            str30: String(30),
            str100: String(100),
            str200: String(200)
        }
    )

db = SQLAlchemy(model_class=Base)

# Import models after setting up database connection
from .user import User, DEFAULT_IMAGE_URL
from .post import Post
from .tag import Tag

# Many-to-Many association table for Post and Tag
post_tag = db.Table("posts_tags",
    Column("post", ForeignKey(Post.id), primary_key=True),
    Column("tag", ForeignKey(Tag.id), primary_key=True)
)
