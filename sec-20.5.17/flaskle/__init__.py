from flask import Flask
from flask_debugtoolbar import DebugToolbarExtension
from .boggle import Boggle

# Session Keys
GAMEBOARD_SKEY = "boggle_gameboard"
STATS_SKEY = "boggle_stats"
WORDS_FOUND_SKEY = "words_found"
# Dictionary Keys
HIGH_SCORE_DKEY = "highScore"
GAMES_PLAYED_DKEY = "gamesPlayed"

debug_toolbar = DebugToolbarExtension()
boggle_game = Boggle()

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