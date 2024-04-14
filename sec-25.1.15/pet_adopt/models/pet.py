from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from .helper import DBHelperMixin
from . import db, str30

#######################################
class Pet(DBHelperMixin, db.Model):
    """Model of a lovable pet waiting to be adopted."""
    __tablename__ = "pets"
    GENERIC_PET_IMAGE = "https://mylostpetalert.com/wp-content/themes/mlpa-child/images/nophoto.gif"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str30]
    species: Mapped[str30]
    photo_url: Mapped[Optional[str]]
    age: Mapped[Optional[int]]
    notes: Mapped[Optional[str]]
    available: Mapped[bool] = mapped_column(default=True)

    def __repr__(self):
        return f"<Pet #{self.id}: {self.name}, {self.species}, {self.age}, Available? {self.available}>"

    @property
    def image_url(self):
        """Return photo URL or a generic placeholder image."""
        return self.photo_url or self.GENERIC_PET_IMAGE