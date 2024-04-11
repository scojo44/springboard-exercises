from datetime import datetime
from . import db
from .helper import DBHelperMixin

class Post(DBHelperMixin, db.Model):
    """Model of a Blogly posting."""
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="posts")

    @property
    def friendly_date(self):
        """Returns a nicer timestamp name."""
        return self.created_at.strftime("%B %-d, %Y, %-I:%M %p")

    def __repr__(self):
        """Return a nicer description of Post"""
        return f"<Post #{self.id}: {self.title[:50]} {self.content[:50]} {self.created_at}>"
