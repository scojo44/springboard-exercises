from flask import Flask, request

def create_app():
    """Initialize the calc application."""
    app = Flask(__name__)

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.calc_bp)

    return app