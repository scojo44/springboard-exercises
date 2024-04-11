from flask import Blueprint

bp = Blueprint("api", __name__, url_prefix="/api/cupcakes")

from . import routes