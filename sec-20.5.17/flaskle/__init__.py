from flask import Flask
from .extensions import debug_toolbar

def create_app():
    """Initialize the Flaskle application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "FlaskDebugTB-Key"

    # Set up plugins
    debug_toolbar.init_app(app)

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.boggle_bp)
    
    return app