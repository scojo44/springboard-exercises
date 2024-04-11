from . import db
from .helper import DBHelperMixin

class Tag(DBHelperMixin, db.Model):
    """Model of a tag"""
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(30), nullable=False, unique=True)

    posts = db.relationship("Post", back_populates="tags", secondary="posts_tags")

    def __repr__(self):
        """Return a nicer description of Tag"""
        return f"<Tag #{self.id}: {self.name}>"
