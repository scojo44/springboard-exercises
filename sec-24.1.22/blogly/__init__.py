"""Blogly application."""
import os, tomllib
from flask import Flask
from .extensions import db, debug_toolbar

def create_app():
    """Initialize the Blogly application."""
    config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
    app = Flask(__name__)
    app.config.from_file(f"../{config_file}", load=tomllib.load, text=False)

    # Set up extensions
    debug_toolbar.init_app(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

        # Register blueprints
        from . import routes
        app.register_blueprint(routes.blogly_bp)

    return app