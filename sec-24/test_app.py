from unittest import TestCase
from app import app
from models import db, User

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///blogly_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config["TESTING"] = True # Have Flask return real errors w/o HTML
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]

db.drop_all()
db.create_all()

class UserViewTests(TestCase):
    """Tests for views with Users."""

    def setUp(self):
        """Add sample users"""
        User.query.delete()

        aerith = User(first_name="Aerith", last_name="Gainsborough", image_url="https://upload.wikimedia.org/wikipedia/en/2/2f/Aerith_Gainsborough.png")
        tifa = User(first_name="Tifa", last_name="Lockhart", image_url="https://upload.wikimedia.org/wikipedia/en/6/61/Tifa_Lockhart_art.png")
        cloud = User(first_name="Cloud", last_name="Strife", image_url="https://upload.wikimedia.org/wikipedia/en/1/16/Princess_Peach_Stock_Art.png")
        zelda = User(first_name="Princess", last_name="Zelda", image_url="https://upload.wikimedia.org/wikipedia/en/6/6e/Link_to_the_Past_Zelda.png")
        db.session.add(aerith)
        db.session.add(tifa)
        db.session.add(cloud)
        db.session.commit()
        self.aerith_id = aerith.id
        self.tifa_id = tifa.id
        self.cloud_id = cloud.id

    def tearDown(self):
        """Clear any incomplete transactions."""
        db.session.rollback()

    def test_list_users(self):
        """See that all test users are listed."""
        with app.test_client() as client:
            resp = client.get("/users")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Aerith", html)
            self.assertIn("Tifa", html)
            self.assertIn("Cloud", html)

    def test_save_new_user(self):
        """Make sure adding a new user works."""
        with app.test_client() as client:
            post_data = {"first":"Peach", "last":"Toadstool", "image":"https://upload.wikimedia.org/wikipedia/en/1/16/Princess_Peach_Stock_Art.png"}
            resp = client.post("/users/new", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Peach Toadstool</h1>", html)

    def test_edit_user(self):
        """Make sure editing an existing user works."""
        with app.test_client() as client:
            # Change Aerith's first name to her name in the english version of FF7 in 1997.
            aeris = User.query.filter_by(first_name="Aerith").first()
            post_data = {"first":"Aeris", "last":aeris.last_name, "image":aeris.image_url}
            resp = client.post(f"/users/{aeris.id}/edit", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Aeris Gainsborough</h1>", html)

    def test_delete_user(self):
        """Make sure deleting a user works."""
        with app.test_client() as client:
            # Delete Cloud Strife
            resp = client.post(f"/users/{self.cloud_id}/delete", data={}, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertNotIn("Cloud Strife</a>", html) # "Cloud Strife" will appear in a flash message
            # See that others are not deleted
            self.assertIn("Aerith", html)
            self.assertIn("Tifa", html)
