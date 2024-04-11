"""Feedback Model"""
from . import db
from .helper import DBHelperMixin

class Feedback(DBHelperMixin, db.Model):
    """Model of a feedback of the app"""
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(20), db.ForeignKey("users.username"), nullable=False)

    user = db.relationship("User", back_populates="feedback")

    def __repr__(self):
        """Return a nicer description of Post"""
        return f"<Feedback #{self.id}: {self.title[:50]} - {self.content[:50]}>"
