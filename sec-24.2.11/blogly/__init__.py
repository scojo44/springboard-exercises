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
        from .blueprints.home import bp as home_bp
        from .blueprints.user import bp as user_bp
        from .blueprints.post import bp as post_bp
        app.register_blueprint(home_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(post_bp)

    return app