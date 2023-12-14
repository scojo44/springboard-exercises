from unittest import TestCase
from app import app
from models import db, User, Post, Tag, PostTag

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///blogly_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config["TESTING"] = True # Have Flask return real errors w/o HTML
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]

db.drop_all()
db.create_all()

##################################################
class UserViewTests(TestCase):
    """Tests for views with Users."""
    def setUp(self):
        """Add sample data"""
        PostTag.query.delete()
        Tag.query.delete()
        Post.query.delete()
        User.query.delete()

        aerith = User(first_name="Aerith", last_name="Gainsborough", image_url="https://upload.wikimedia.org/wikipedia/en/2/2f/Aerith_Gainsborough.png")
        tifa = User(first_name="Tifa", last_name="Lockhart", image_url="https://upload.wikimedia.org/wikipedia/en/6/61/Tifa_Lockhart_art.png")
        cloud = User(first_name="Cloud", last_name="Strife", image_url="https://upload.wikimedia.org/wikipedia/en/1/16/Princess_Peach_Stock_Art.png")
        aerith.save()
        tifa.save()
        cloud.save()

        level = Post(title="Level Up!", content="Level 14: Learned Curaga", user_id=aerith.id)
        treasure = Post(title="Found a Vermillion Cloak", content="45DEF, Adds Refresh effect", user_id=aerith.id)
        level.save()
        treasure.save()

        ff7 = Tag(name="FFVII")
        ff7.save()

        self.aerith_id = aerith.id
        self.tifa_id = tifa.id
        self.cloud_id = cloud.id
        self.level_id = level.id
        self.treasure_id = treasure.id
        self.ff7_id = ff7.id

    def tearDown(self):
        """Clear any incomplete transactions."""
        db.session.rollback()

    # Home Tests
    def test_show_recent_posts(self):
        """See that the two posts appear on the home page."""
        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Aerith Gainsborough", html)
            self.assertIn("Level Up!", html)
            self.assertIn("Learned Curaga", html)
            self.assertIn("Vermillion Cloak", html)
            self.assertIn("45DEF", html)

    def test_404_handler(self):
        with app.test_client() as client:
            resp = client.get("/not_there")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 404)
            self.assertIn("404 - DNF!", html)

    # User Tests
    def test_list_users(self):
        """See that all test users are listed."""
        with app.test_client() as client:
            resp = client.get("/users")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Aerith", html)
            self.assertIn("Tifa", html)
            self.assertIn("Cloud", html)

    def test_show_user_info(self):
        """Make sure user info and posts appear."""
        with app.test_client() as client:
            resp = client.get(f"/users/{self.aerith_id}")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Aerith", html)
            self.assertIn("Level Up!", html)
            self.assertIn("Vermillion Cloak", html)

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
            aeris = User.query.get(self.aerith_id)
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

    # Post Tests
    def test_save_new_post(self):
        """Make sure adding a new post with a tag works."""
        with app.test_client() as client:
            post_data = {"title":"Punch", "content":"Kick", "tags":self.ff7_id}
            resp = client.post(f"/users/{self.tifa_id}/posts/new", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Punch</h1>", html)
            self.assertIn("<pre>Kick</pre>", html)
            self.assertIn("FFVII", html)

    def test_edit_post(self):
        """Make sure editing an existing post and adding a tag works."""
        with app.test_client() as client:
            level = Post.query.get(self.level_id)
            post_data = {"title":"Level Up Again!", "content":"Level 15: Learned Raise", "tags":self.ff7_id}
            resp = client.post(f"/posts/{level.id}/edit", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Level Up Again!</h1>", html)
            self.assertIn("<pre>Level 15:", html)
            self.assertIn("FFVII", html)

    def test_delete_post(self):
        """Make sure deleting a user works."""
        with app.test_client() as client:
            # Delete Level Up post
            resp = client.post(f"/posts/{self.level_id}/delete", data={}, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertNotIn("Level Up!</a>", html) # Title will appear in a flash message
            # See that others are not deleted
            self.assertIn("Vermillion Cloak", html)

    # Tag Tests
    def test_save_new_tag(self):
        """Make sure adding a new tag while assigning posts works."""
        with app.test_client() as client:
            post_data = {"name":"Final Fantasy", "posts":[self.level_id, self.treasure_id]}
            resp = client.post(f"/tags/new", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Tag: Final Fantasy</h1>", html)
            self.assertIn("Level Up!", html)
            self.assertIn("Vermillion Cloak", html)

    def test_edit_tag(self):
        """Make sure editing an existing tag and assigning a post works."""
        with app.test_client() as client:
            ff7 = Tag.query.get(self.ff7_id)
            post_data = {"name":"FF7", "posts":self.level_id}
            resp = client.post(f"/tags/{ff7.id}/edit", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Tag: FF7</h1>", html)
            self.assertIn("Level Up!", html)
            self.assertNotIn("Vermillion Cloak", html)
