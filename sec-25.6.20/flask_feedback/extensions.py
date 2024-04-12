"""Misc Flask Extensions"""
from flask_bcrypt import Bcrypt
from flask_debugtoolbar import DebugToolbarExtension

bcrypt = Bcrypt()
debug_toolbar = DebugToolbarExtension()
