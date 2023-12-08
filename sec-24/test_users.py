from unittest import TestCase
from app import app
from models import db, User, DEFAULT_IMAGE_URL

class UserTests(TestCase):
    @classmethod
    def setUpClass(cls):
        """Set debug settings"""
        app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///blogly_test'
        app.config['SQLALCHEMY_ECHO'] = False
        db.drop_all()
        db.create_all()

    def setUp(self):
        """Clear existing test users."""
        User.query.delete()
        self.good_user = User(first_name="Charlie", last_name="Brown")
        self.bad_user = User(first_name="ThisNameFarExceedsTheVarChar30Limit", last_name="Test")

    def tearDown(self):
        """Clear any incomplete transactions."""
        db.session.rollback()

    def test_full_name(self):
        """Make sure full name is correct."""
        self.assertEqual(self.good_user.full_name, "Charlie Brown")

    def test_save(self):
        """Verify saving to database works assuming the database is running."""
        result = self.good_user.save()
        self.assertTrue(result)
        user = User.query.get(1)
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
        self.assertIsNone(User.query.get(1))

    def test_get_last_error(self):
        """Make sure last_error is set on failures and returned."""
        result = self.bad_user.save()
        self.assertFalse(result)
        self.assertIsInstance(self.bad_user.get_last_error(), Exception)
        # Make sure user.last_error is cleared after getting the error
        self.assertIsNone(self.bad_user.get_last_error())