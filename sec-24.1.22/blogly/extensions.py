from flask_debugtoolbar import DebugToolbarExtension
from flask_sqlalchemy import SQLAlchemy
from .models.base import Base

debug_toolbar = DebugToolbarExtension()
db = SQLAlchemy(model_class=Base)