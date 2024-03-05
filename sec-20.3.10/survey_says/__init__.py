from flask import Flask
from flask_debugtoolbar import DebugToolbarExtension

debug_toolbar = DebugToolbarExtension()

def create_app():
    """Initialize the Madlibs application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "gEoCaChInG123"
    app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False

    # Set up plugins
    debug_toolbar.init_app(app)

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.survey_bp)
    
    return app