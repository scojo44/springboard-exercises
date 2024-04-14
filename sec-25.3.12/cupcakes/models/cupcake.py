from sqlalchemy.orm import Mapped, mapped_column
from .helper import DBHelperMixin
from . import db, str30

class Cupcake(DBHelperMixin, db.Model):
    """Model of a yummy cupcake."""
    __tablename__ = "cupcakes"
    GENERIC_CUPCAKE_IMAGE = "https://tinyurl.com/demo-cupcake"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    flavor: Mapped[str30]
    size: Mapped[str30]
    rating: Mapped[float]
    image: Mapped[str] = mapped_column(default=GENERIC_CUPCAKE_IMAGE)

    def serialize(self):
        return {
            "id": self.id,
            "flavor": self.flavor,
            "size": self.size,
            "rating": self.rating,
            "image": self.image
        }
