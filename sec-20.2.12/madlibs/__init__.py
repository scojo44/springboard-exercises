from flask import Flask
from flask_debugtoolbar import DebugToolbarExtension

debug_toolbar = DebugToolbarExtension()

def create_app():
    """Initialize the Madlibs application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "ABC123-xyz-789"

    # Set up plugins
    debug_toolbar.init_app(app)

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.home_bp)

    return app