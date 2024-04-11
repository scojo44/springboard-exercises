"""Flask app for Cupcakes"""
import os, tomllib
from flask import Flask
from .extensions import debug_toolbar
from .models import db

def create_app():
    """Initialize the Cupcakes application."""
    config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
    app = Flask(__name__)
    app.config.from_file(f"../{config_file}", load=tomllib.load, text=False)

    # Set up extensions
    debug_toolbar.init_app(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

        # Register blueprints
        from .blueprints import home_bp, api_bp
        app.register_blueprint(home_bp)
        app.register_blueprint(api_bp)

    return app
