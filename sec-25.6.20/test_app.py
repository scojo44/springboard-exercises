"""Flask Feedback Tests"""
from unittest import TestCase
from app import app
from models import db, User, Feedback

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///feedback_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config["TESTING"] = True # Have Flask return real errors w/o HTML
app.config["WTF_CSRF_ENABLED"] = False
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]

db.drop_all()
db.create_all()

#######################################
class FeedbackViewTests(TestCase):
    """Tests for Flask Feedback."""

    def setUp(self):
        """Add sample data."""
        for user in User.query.all():
            db.session.delete(user)

        kitty = User.register(username="garfield", password="lasagna9", email="thecat@garfield.com", first="Garfield", last="The Cat")
        admin = User.register(username="jon", password="garfield", email="jon@garfield.com", first="Jon", last="Arbuckle", is_admin=True)
        kitty.save()
        admin.save()

        fb1 = Feedback(title="I love lasagna!", content="Burp!", username=kitty.username)
        fb2 = Feedback(title="Odie", content="It's fun to push him off the table.", username=kitty.username)
        fb1.save()
        fb2.save()

        self.kitty_username = kitty.username
        self.fb1_id = fb1.id
        self.fb2_id = fb2.id

    def tearDown(self):
        """Clear any incomplete transactions."""
        db.session.rollback()

    def test_register_user_form(self):
        """Make sure the register form loads."""
        with app.test_client() as client:
            resp = client.get("/register")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Email Address:", html)

    def test_register_user(self):
        """Make sure registering a user isn't broken."""
        with app.test_client() as client:
            post_data = {
                "username":"scooby",
                "password":"roobydoobydoo!",
                "email":"scoob@meddlingkids.com",
                "first_name": "Scooby",
                "last_name": "Doo"
                }
            resp = client.post("/register", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Welcome!", html)
            self.assertIn("scooby", html)
            self.assertIn("Scooby Doo", html)

    def test_register_user_taken(self):
        """Make sure username-taken message works."""
        with app.test_client() as client:
            post_data = {
                "username":"garfield",
                "password":"nermalisannoying",
                "email":"thecat@garfield.com",
                "first_name": "Garfield",
                "last_name": "The Cat"
                }
            resp = client.post("/register", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("username is already taken", html)

    def test_login_form(self):
        """Make sure the login form loads."""
        with app.test_client() as client:
            resp = client.get("/login")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Username:", html)
            self.assertIn("Password:", html)

    def test_login(self):
        """Test user log in."""
        with app.test_client() as client:
            self.login(client)

    def test_login_fail(self):
        """Test log in failure."""
        with app.test_client() as client:
            post_data = {"username":"garfield", "password":"lasagna123"}
            resp = client.post("/login", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Incorrect username and/or password", html)
            self.assertIn("Password:", html)

    def test_logout(self):
        """Test user logout."""
        with app.test_client() as client:
            self.login(client)
            resp = client.post("/logout", data={}, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("You have logged out.", html)

    def login(self, client):
        """Helper function to log in a user for some tests."""
        post_data = {"username":"garfield", "password":"lasagna9"}
        resp = client.post("/login", data=post_data, follow_redirects=True)
        html = resp.get_data(as_text=True)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("Welcome back!", html)
        self.assertIn("garfield", html)
        self.assertIn("Garfield The Cat", html)
        self.assertIn("Add Feedback", html)

    def login_as_admin(self, client):
        """Helper function to log in an admin user for some tests."""
        post_data = {"username":"jon", "password":"garfield"}
        resp = client.post("/login", data=post_data, follow_redirects=True)
        html = resp.get_data(as_text=True)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("Welcome back!", html)
        self.assertIn("jon", html)
        self.assertIn("Jon Arbuckle", html)
        self.assertIn("Add Feedback", html)

    def test_show_user(self):
        """Test user display."""
        with app.test_client() as client:
            self.login(client)
            resp = client.get(f"/users/{self.kitty_username}", follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Garfield The Cat", html)
            self.assertIn("Add Feedback", html)
            self.assertIn("Delete", html)

    def test_delete_user(self):
        """Test delete user and his feedback then go to the login page."""
        with app.test_client() as client:
            self.login(client)
            resp = client.post(f"/users/{self.kitty_username}/delete", data={}, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("logged out and your account has been deleted.", html)
            self.assertIn("Password:", html)

    def test_admin_delete_user(self):
        """Test admin deleting user and his feedback then go to the home page."""
        with app.test_client() as client:
            self.login_as_admin(client)
            resp = client.post(f"/users/{self.kitty_username}/delete", data={}, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("User garfield and their feedback have been deleted.", html)

    def test_add_feedback(self):
        """Test user adding feedback."""
        with app.test_client() as client:
            self.login(client)
            post_data = {"title":"Test Title", "content":"Test content"}
            resp = client.post("/users/garfield/feedback/add", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Thanks for your feedback!", html)
            self.assertIn("thecat@garfield.com", html)
            self.assertIn("Test Title", html)
            self.assertIn("Test content", html)

    def test_update_feedback(self):
        """Test user updating feedback."""
        with app.test_client() as client:
            self.login(client)
            post_data = {"title": "I love lasagna!", "content":"Belch!!!!"}
            resp = client.post(f"/feedback/{self.fb1_id}/update", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("feedback was successfully updated.", html)
            self.assertIn("thecat@garfield.com", html)
            self.assertIn("Belch!!!!", html)

    def test_admin_update_feedback(self):
        """Test admin updating another user's feedback ."""
        with app.test_client() as client:
            self.login_as_admin(client)
            post_data = {"title": "I love lasagna!", "content":"Belch!!!! [That's rude! --Jon]"}
            resp = client.post(f"/feedback/{self.fb1_id}/update", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("feedback was successfully updated.", html)
            self.assertIn("thecat@garfield.com", html)
            self.assertIn("Belch!!!! [That's rude!", html)

    def test_delete_feedback(self):
        """Test user deleting feedback."""
        with app.test_client() as client:
            self.login(client)
            resp = client.post(f"/feedback/{self.fb2_id}/delete", data={}, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Feedback 'Odie' was successfully deleted.", html)
            self.assertNotIn("fun to push him off", html)

    def test_admin_delete_feedback(self):
        """Test admin deleting another user's feedback."""
        with app.test_client() as client:
            self.login_as_admin(client)
            resp = client.post(f"/feedback/{self.fb2_id}/delete", data={}, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Feedback 'Odie' was successfully deleted.", html)
            self.assertNotIn("fun to push him off", html)
