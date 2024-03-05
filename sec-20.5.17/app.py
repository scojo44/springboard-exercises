from flask import Flask, request, render_template, session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

# Session Keys
GAMEBOARD_SKEY = "boggle_gameboard"
STATS_SKEY = "boggle_stats"
WORDS_FOUND_SKEY = "words_found"
# Dictionary Keys
HIGH_SCORE_DKEY = "highScore"
GAMES_PLAYED_DKEY = "gamesPlayed"

app = Flask(__name__)
app.config["SECRET_KEY"] = "FlaskDebugTB-Key"
# app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension(app)
boggle_game = Boggle()

@app.get("/")
def index():
    return render_template("setup.html.jinja")

@app.post("/start")
def setup_game():
    """Create the gameboard and show it."""
    rows = int(request.form.get("rows", 5))
    columns = int(request.form.get("columns", 5))
    time_limit = int(request.form.get("time-limit", 1))
    create_gameboard(rows, columns)
    init_stats()
    session[WORDS_FOUND_SKEY] = []
    return render_template("gameboard.html.jinja",
                            gameboard=session[GAMEBOARD_SKEY],
                            high_score=session[STATS_SKEY].get(HIGH_SCORE_DKEY, 0),
                            games_played=session[STATS_SKEY].get(GAMES_PLAYED_DKEY, 0),
                            time_limit=time_limit)

def init_stats():
    """Setup the stats object on the session"""
    if not session.get(STATS_SKEY):
        session[STATS_SKEY] = {
            HIGH_SCORE_DKEY: 0,
            GAMES_PLAYED_DKEY: 0
        }

def create_gameboard(rows, columns):
    """Create the gameboard and save it to the session."""
    session[GAMEBOARD_SKEY] = boggle_game.make_board(rows, columns)

@app.get("/guess")
def guess_word():
    """Accept a guessed word and check if it can be found on the gameboard."""
    word = request.args.get("word")
    words_found = session[WORDS_FOUND_SKEY]

    # Make sure we got something to check
    if not word:
        return {"result": "not-word"}

    result = boggle_game.check_valid_word(session[GAMEBOARD_SKEY], word)

    if(word in words_found):
        return {"result": "already-found"}

    # Save found words
    if result == "ok":
        words_found.append(word)
        session[WORDS_FOUND_SKEY] = words_found

    return {"result": result}

@app.post("/finish")
def score_game():
    """After the game ends, save the score and keep track of how many games played."""
    new_score = request.json.get("score", 0)
    stats = session.get(STATS_SKEY)
    # Check for a new high score and save it
    if new_score > stats[HIGH_SCORE_DKEY]:
        stats[HIGH_SCORE_DKEY] = new_score
    stats[GAMES_PLAYED_DKEY] += 1
    session[STATS_SKEY] = stats
    stats["allWords"] = find_all_words()
    return stats

def find_all_words():
    return [word for word in boggle_game.words if len(word) >= 3 and "ok" == boggle_game.check_valid_word(session[GAMEBOARD_SKEY], word)]