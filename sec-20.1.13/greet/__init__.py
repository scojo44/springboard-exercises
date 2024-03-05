from flask import Flask

def create_app():
    """Initialize the greet application."""
    app = Flask(__name__)

    # === Routes === # App is way too simple for blueprints
    @app.get("/")
    def welcome_home():
        return "Welcome here.  This is a warp zone."
    @app.get("/welcome")
    def welcome():
        return "Welcome"

    @app.get("/welcome/<place>")
    def welcome_here(place):
        return "Welcome, " + place
    
    return app