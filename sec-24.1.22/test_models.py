import os
os.environ['APP_TEST_CONFIG'] = 'config_test.toml'

from unittest import TestCase
from app import app
from models import db, User, DEFAULT_IMAGE_URL

app.testing = True

with app.app_context():
    db.drop_all()
    db.create_all()

class UserTests(TestCase):
    """Tests for the User model."""

    def setUp(self):
        """Add sample users"""
        # Clear users table
        with app.app_context():
            for user in db.session.scalars(db.select(User)):
                db.session.delete(user)
            db.session.commit()

        # Create sample users
        self.good_user = User(first_name="Charlie", last_name="Brown")
        self.bad_user = User(first_name="ThisNameFarExceedsTheVarChar30Limit", last_name="Test")

    def tearDown(self):
        """Clear any incomplete transactions."""
        with app.app_context():
            db.session.rollback()

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