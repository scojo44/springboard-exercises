from unittest import TestCase
from app import app
from models import db, Pet

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///adoptpets_test'
app.config['SQLALCHEMY_ECHO'] = False
app.config["TESTING"] = True # Have Flask return real errors w/o HTML
app.config["WTF_CSRF_ENABLED"] = False
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]

db.drop_all()
db.create_all()

#######################################
class PetViewTests(TestCase):
    """Tests for pet adoption views."""
    def setUp(self):
        """Add sample data."""
        Pet.query.delete()

        kitty = Pet(name="Garfield", species="cat", age=4)
        kitty.save()

        self.kitty_id = kitty.id

    def tearDown(self):
        """Clear any incomplete transactions."""
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
        with app.test_client() as client:
            kitty = Pet.query.get(self.kitty_id)
            resp = client.get(f"/{kitty.id}")
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Edit Garfield", html)
            self.assertIn("Species: cat", html)

    def test_edit_pet(self):
        """Make sure editing an existing pet works."""
        with app.test_client() as client:
            kitty = Pet.query.get(self.kitty_id)
            post_data = {"notes":"Garfield loves lasagna."}
            resp = client.post(f"/{kitty.id}", data=post_data, follow_redirects=True)
            html = resp.get_data(as_text=True)
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Garfield loves lasagna.", html)
