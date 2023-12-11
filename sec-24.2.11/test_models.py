from unittest import TestCase
from datetime import datetime
from app import app
from models import db, User, Post, DEFAULT_IMAGE_URL

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///blogly_test'
app.config['SQLALCHEMY_ECHO'] = False

db.drop_all()
db.create_all()

##################################################
class BaseModelTest(TestCase):
    """Common test methods"""
    def setUp(self):
        """Clear existing test users."""
        Post.query.delete()
        User.query.delete()
        self.good_user = User(first_name="Charlie", last_name="Brown")
        self.bad_user = User(first_name="ThisNameFarExceedsTheVarChar30Limit", last_name="Test")
        test_created_at = datetime.strptime("4-4-2024 4:22:55 PM", "%m-%d-%Y %I:%M:%S %p")
        self.good_post = Post(title="Good Grief", content="If Lucy offers to hold the football and pulls it away one more time...", created_at=test_created_at)
        self.bad_post = Post(title="This title exceeds the varchar(100) limit ++++++++++++++++++++++++++ abcdefghijklmonpqrstuvwxyz 0123456789", content="Test")

    def tearDown(self):
        """Clear any incomplete transactions."""
        db.session.rollback()

##################################################
class UserTests(BaseModelTest):
    """Tests for the User model."""
    def test_full_name(self):
        """Make sure full name is correct."""
        self.assertEqual(self.good_user.full_name, "Charlie Brown")

    def test_save(self):
        """Verify saving to database works assuming the database is running."""
        result = self.good_user.save()
        self.assertTrue(result)
        user = User.query.get(self.good_user.id)
        self.assertEqual(user.first_name, "Charlie")
        self.assertEqual(user.last_name, "Brown")
        self.assertEqual(user.image_url, DEFAULT_IMAGE_URL)

    def test_save_fail(self):
        """Verify handling database failure works."""
        result = self.bad_user.save()
        self.assertFalse(result)
        self.assertIsInstance(self.bad_user.get_last_error(), Exception)

    def test_delete(self):
        """Verify deleting from a running database."""
        result = self.good_user.delete()
        self.assertTrue(result)
        self.assertIsNone(User.query.filter_by(id=self.good_user.id).one_or_none())

    def test_get_last_error(self):
        """Make sure last_error is set on failures and returned."""
        result = self.bad_user.save()
        self.assertFalse(result)
        self.assertIsInstance(self.bad_user.get_last_error(), Exception)
        # Make sure user.last_error is cleared after getting the error
        self.assertIsNone(self.bad_user.get_last_error())

##################################################
class PostTests(BaseModelTest):
    """Tests for the Post model."""
    def test_friendly_date(self):
        """Check for correct friendly create date"""
        self.assertEqual(self.good_post.friendly_date, "April 4, 2024, 4:22 PM")

    def test_save(self):
        """Verify saving to database works assuming the database is running."""
        # Get the user id of the good user
        self.good_user.save()
        self.good_post.user_id = self.good_user.id
        # Now try saving post
        result = self.good_post.save()
        self.assertTrue(result)
        post = Post.query.get(self.good_post.id)
        self.assertEqual(post.user.full_name, "Charlie Brown")
        self.assertEqual(post.title, "Good Grief")
        self.assertIn("Lucy", post.content)

    def test_save_fail(self):
        """Verify handling database failure works."""
        # Get the user id of the good user
        self.good_user.save()
        self.bad_post.user_id = self.good_user.id
        # Now try saving post
        result = self.bad_post.save()
        self.assertFalse(result)
        self.assertIsInstance(self.bad_post.get_last_error(), Exception)