"""User Routes"""
from flask import Blueprint, session
from ...models import User

bp = Blueprint("user", __name__)

def get_logged_in_user():
    """Helper function to get the logged in user."""
    return User.get(session.get("username"))

from . import routes