from unittest import TestCase
from app import app, GAMEBOARD_SKEY, STATS_SKEY, HIGH_SCORE_DKEY, GAMES_PLAYED_DKEY, WORDS_FOUND_SKEY
from flask import session
from boggle import Boggle
import json

class FlaskTests(TestCase):
    """Tests for the Boggle app"""

    @classmethod
    def setUpClass(cls):
        """Set debug settings and create a mock gameboard."""
        app.config["TESTING"] = True
        app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]
        cls.TEST_BOGGLE_BOARD = [
            [letter for letter in "JIPUL"],
            [letter for letter in "PYCEG"],
            [letter for letter in "DTLHN"],
            [letter for letter in "SPHOR"],
            [letter for letter in "SQYWS"],
        ]

    def test_create_gameboard(self):
        """Check that HTML for a gameboard was returned."""
        with app.test_client() as client:
            post_data = {"rows": "3", "columns": "3", "time-limit": "5"}
            resp = client.post("/start", data=post_data) # Initialize game and session
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn('<table id="gameboard" data-time-limit="5">', html)

    def test_setup_game(self):
        """Make sure a 5x5 gameboard was saved to the session."""
        with app.test_client() as client:
            post_data = {"rows": "5", "columns": "5", "time-limit": "5"}
            resp = client.post("/start", data=post_data) # Initialize game and session
            self.assertEqual(resp.status_code, 200)
            # Check that the gameboard is a 5x5 matrix
            self.assertIsNotNone(session[GAMEBOARD_SKEY])
            self.assertIsInstance(session[GAMEBOARD_SKEY], list)
            self.assertEqual(len(session[GAMEBOARD_SKEY]), 5)
            self.assertIsInstance(session[GAMEBOARD_SKEY][0], list)
            self.assertEqual(len(session[GAMEBOARD_SKEY][0]), 5)
            # Check that a stats object exists on the session
            self.assertIsNotNone(session[STATS_SKEY])
            self.assertIsInstance(session[STATS_SKEY], dict)
            self.assertGreaterEqual(session[STATS_SKEY][HIGH_SCORE_DKEY], 0)
            self.assertGreaterEqual(session[STATS_SKEY][GAMES_PLAYED_DKEY], 0)

    def test_check_valid_word(self):
        """Make sure words are checked correctly."""
        b = self.TEST_BOGGLE_BOARD
        game = Boggle()
        game.make_board()
        self.assertEqual("ok", game.check_valid_word(b, "python"))
        self.assertEqual("not-on-board", game.check_valid_word(b, "cake"))
        self.assertEqual("not-word", game.check_valid_word(b, "jylos")) # Appears on the board
        self.assertEqual("not-word", game.check_valid_word(b, "xyzzy")) # Not a word and not on the board

    def test_guess_check(self):
        """See that guesses are accepted and checked."""
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session[GAMEBOARD_SKEY] = self.TEST_BOGGLE_BOARD
                change_session[WORDS_FOUND_SKEY] = []
            # Try a guess that appears on the board
            resp = client.get("/guess?word=python")
            js = resp.get_data(as_text=True)
            self.assertIn("ok", js)
            # Try a missing guess
            resp = client.get("/guess")
            js = json.loads(resp.get_data(as_text=True))
            self.assertEqual(js["result"], "not-word")
            
    def test_finish(self):
        """Finish should save the score and increment the game count."""
        with app.test_client() as client:
            client.post("/start") # Initialize game and session
            with client.session_transaction() as change_session:
                change_session[GAMEBOARD_SKEY] = self.TEST_BOGGLE_BOARD
            # Finish some games, (score, high score, games played)
            self.send_finish_request(client, 45, 45, 1)
            self.send_finish_request(client, 99, 99, 2)
            self.send_finish_request(client, 77, 99, 3)

    def send_finish_request(self, client, new_score, high_score, games_played):
        """Send request with finished game score."""
        print("Sending request to finish.  Finding all the words will take awhile...")
        resp = client.post("/finish", json={"score": new_score})
        js = json.loads(resp.get_data(as_text=True))
        self.assertEqual(js[HIGH_SCORE_DKEY], high_score)
        self.assertEqual(js[GAMES_PLAYED_DKEY], games_played)
        self.assertIn("python", js["allWords"])
