"""Blogly application."""
import os, tomllib
from flask import Flask, render_template
from .extensions import debug_toolbar
from .models import db

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
        from .blueprints import home_bp, user_bp, post_bp, tag_bp
        app.register_blueprint(home_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(post_bp)
        app.register_blueprint(tag_bp)

    # App-wide 404 handler
    @app.errorhandler(404)
    def show_not_found(e):
        return render_template("errors/404.html.jinja"), 404

    return app
