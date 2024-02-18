import os
os.environ['APP_TEST_CONFIG'] = 'config_test.toml'

from unittest import TestCase
from datetime import datetime
from app import app
from models import db, User, Post, Tag, DEFAULT_IMAGE_URL

app.testing = True

with app.app_context():
    db.drop_all()
    db.create_all()

##################################################
class BaseModelTest(TestCase):
    """Common test methods"""
    def setUp(self):
        """Add sample data"""
        with app.app_context():
            # Clear the tables
            for tag in Tag.get_all():
                db.session.delete(tag)
            for user in User.get_all():
                db.session.delete(user)
            db.session.commit()

        # Create sample users
        self.good_user = User(first_name="Charlie", last_name="Brown")
        self.bad_user = User(first_name="ThisNameFarExceedsTheVarChar30Limit", last_name="Test")
        # Create sample posts
        test_created_at = datetime.strptime("4-4-2024 4:22:55 PM", "%m-%d-%Y %I:%M:%S %p")
        self.good_post = Post(title="Good Grief", content="If Lucy offers to hold the football and pulls it away one more time...", created_at=test_created_at)
        self.bad_post = Post(title="This title exceeds the varchar(100) limit ++++++++++++++++++++++++++ abcdefghijklmonpqrstuvwxyz 0123456789", content="Test")
        # Create sample tags
        self.good_tag = Tag(name="Peanuts")
        self.bad_tag = Tag(name="ThisNameFarExceedsTheVarChar30Limit")

    def tearDown(self):
        """Clear any incomplete transactions."""
        with app.app_context():
            db.session.rollback()

##################################################
class UserTests(BaseModelTest):
    """Tests for the User model."""
    def test_full_name(self):
        """Make sure full name is correct."""
        self.assertEqual(self.good_user.full_name, "Charlie Brown")

    def test_save(self):
        """Verify saving to database works assuming the database is running."""
        with app.app_context():
            result = self.good_user.save()
            self.assertTrue(result)
            user = db.session.get(User, self.good_user.id)

        self.assertEqual(user.first_name, "Charlie")
        self.assertEqual(user.last_name, "Brown")
        self.assertEqual(user.image_url, DEFAULT_IMAGE_URL)

    def test_save_fail(self):
        """Verify handling database failure works."""
        with app.app_context():
            result = self.bad_user.save()

        self.assertFalse(result)
        self.assertIsInstance(self.bad_user.get_last_error(), Exception)

    def test_delete(self):
        """Verify deleting from a running database."""
        with app.app_context():
            result = self.good_user.save()
            self.assertIsInstance(self.good_user.id, int)
            self.assertTrue(result)
            result = self.good_user.delete()
            self.assertTrue(result)
            self.assertIsNone(db.session.get(User, self.good_user.id))

    def test_get_last_error(self):
        """Make sure last_error is set on failures and returned."""
        with app.app_context():
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
        with app.app_context():
            # Get the user id of the good user
            self.good_user.save()
            self.good_post.user_id = self.good_user.id
            # Now try saving post
            result = self.good_post.save()
            self.assertTrue(result)
            post = Post.get(self.good_post.id)
            self.assertEqual(post.user.full_name, "Charlie Brown")
            self.assertEqual(post.title, "Good Grief")
            self.assertIn("Lucy", post.content)

    def test_save_fail(self):
        """Verify handling database failure works."""
        with app.app_context():
            # Get the user id of the good user
            self.good_user.save()
            self.bad_post.user_id = self.good_user.id
            # Now try saving post
            result = self.bad_post.save()
            self.assertFalse(result)
            self.assertIsInstance(self.bad_post.get_last_error(), Exception)

##################################################
class TagTests(BaseModelTest):
    """Tests for the Tag model."""
    def test_save(self):
        """Verify saving to database works assuming the database is running."""
        with app.app_context():
            result = self.good_tag.save()
            self.assertTrue(result)
            tag = Tag.get(self.good_tag.id)
            self.assertEqual(tag.name, "Peanuts")

    def test_save_fail(self):
        """Verify handling database failure works."""
        with app.app_context():
            result = self.bad_tag.save()

        self.assertFalse(result)
        self.assertIsInstance(self.bad_tag.get_last_error(), Exception)

    def test_add_tag_to_post(self):
        """Make sure a tag can be added to a post."""
        self.good_post.tags.append(self.good_tag)
        self.assertEqual(len(self.good_post.tags), 1)
        self.assertEqual(self.good_post.tags[0].name, "Peanuts")

    def test_add_post_to_tag(self):
        """Make sure a post can be added to a tag."""
        self.good_tag.posts.append(self.good_post)
        self.assertEqual(len(self.good_tag.posts), 1)
        self.assertEqual(self.good_tag.posts[0].title, "Good Grief")