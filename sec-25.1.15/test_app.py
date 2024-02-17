import os
os.environ['APP_TEST_CONFIG'] = 'config_test.toml'

from unittest import TestCase
from app import app
from models import db, Pet

app.testing = True

with app.app_context():
    db.drop_all()
    db.create_all()

#######################################
class PetViewTests(TestCase):
    """Tests for pet adoption views."""
    def setUp(self):
        """Add sample data."""
        with app.app_context():
            # Clear pets table
            for pet in db.session.scalars(db.select(Pet)):
                db.session.delete(pet)

            # Create a sample pet
            kitty = Pet(name="Garfield", species="cat", age=4)
            kitty.save()
            self.kitty_id = kitty.id

    def tearDown(self):
        """Clear any incomplete transactions."""
        with app.app_context():
            db.session.rollback()

    def test_list_pets(self):
        """See that pets appear on the home page."""
        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Garfield", html)
            self.assertIn("cat", html)

    def test_get_add_pet_form(self):
        with app.test_client() as client:
            resp = client.get("/add")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Pet name:", html)
            self.assertIn("Species:", html)
            self.assertIn("Age:", html)
            self.assertIn("Photo URL:", html)

    def test_save_new_pet(self):
        with app.test_client() as client:
            post_data = {"name":"Scooby", "species":"dog"}
            resp = client.post("/add", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Pet Scooby added successfully", html)
            self.assertIn(">Scooby</a>", html)
            self.assertIn("Species: dog", html)

    def test_show_pet(self):
        """Make sure showing an existing pet works."""
        with app.app_context():
            kitty = db.get_or_404(Pet, self.kitty_id)

        with app.test_client() as client:
            resp = client.get(f"/{kitty.id}")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Edit Garfield", html)
            self.assertIn("Species: cat", html)

    def test_edit_pet(self):
        """Make sure editing an existing pet works."""
        with app.app_context():
            kitty = db.get_or_404(Pet, self.kitty_id)

        with app.test_client() as client:
            post_data = {"notes":"Garfield loves lasagna."}
            resp = client.post(f"/{kitty.id}", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Garfield loves lasagna.", html)
