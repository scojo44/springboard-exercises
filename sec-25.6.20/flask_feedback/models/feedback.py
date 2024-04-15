"""Feedback Model"""
from typing import List
from sqlalchemy.orm import Mapped, mapped_column
from .helper import DBHelperMixin
from . import db, str20, str50

class Feedback(DBHelperMixin, db.Model):
    """Model of a feedback of the app"""
    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str50]
    content: Mapped[str]
    username: Mapped[str20] = mapped_column(db.ForeignKey("users.username"))

    user: Mapped[List["User"]] = db.relationship(back_populates="feedback")

    def __repr__(self):
        """Return a nicer description of Post"""
        return f"<Feedback #{self.id}: {self.title} - {self.content[:50]}>"
