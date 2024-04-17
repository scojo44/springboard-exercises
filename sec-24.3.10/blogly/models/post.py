from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .helper import DBHelperMixin
from . import db, str100, User

class Post(DBHelperMixin, db.Model):
    """Model of a Blogly posting."""
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str100]
    content: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.now())
    user_id: Mapped[int] = mapped_column(ForeignKey(User.id), nullable=False)

    user: Mapped[list["User"]] = db.relationship(back_populates="posts")
    tags: Mapped[list["Tag"]] = db.relationship(back_populates="posts", secondary="posts_tags")

    @property
    def friendly_date(self):
        """Returns a nicer timestamp name."""
        return self.created_at.strftime("%B %-d, %Y, %-I:%M %p")

    def __repr__(self):
        """Return a nicer description of Post"""
        return f"<Post #{self.id}: {self.title[:50]} {self.content[:50]} {self.created_at}>"
