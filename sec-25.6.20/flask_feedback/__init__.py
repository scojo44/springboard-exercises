import os, tomllib
from flask import Flask, redirect, render_template, request, session, flash
from .extensions import debug_toolbar
from .models import db, User, Feedback
from .forms import LoginForm, RegisterForm, FeedbackForm, DeleteForm

def create_app():
    """Initialize the Flask Feedback application."""
    config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
    app = Flask(__name__)
    app.config.from_file(f"../{config_file}", load=tomllib.load, text=False)

    # Set up extensions
    debug_toolbar.init_app(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

        # Register blueprints
        from .blueprints import home_bp, auth_bp, user_bp, feedback_bp
        app.register_blueprint(home_bp)
        app.register_blueprint(auth_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(feedback_bp)

    return app
