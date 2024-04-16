from typing import List
from sqlalchemy.orm import Mapped, mapped_column
from .helper import DBHelperMixin
from . import db, str30

class Tag(DBHelperMixin, db.Model):
    """Model of a tag"""
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str30] = mapped_column(unique=True)

    posts: Mapped[List["Post"]] = db.relationship(back_populates="tags", secondary="posts_tags")

    def __repr__(self):
        """Return a nicer description of Tag"""
        return f"<Tag #{self.id}: {self.name}>"
