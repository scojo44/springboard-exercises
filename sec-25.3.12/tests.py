from unittest import TestCase
from app import app
from models import db, Cupcake

# Make Flask errors be real errors, sans HTML
app.config['TESTING'] = True
# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_test'
app.config['SQLALCHEMY_ECHO'] = False
# Other packages with fluff to remove
app.config["WTF_CSRF_ENABLED"] = False
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]

# Start with a clean database
db.drop_all()
db.create_all()

CUPCAKE_API_PATH = "/api/cupcakes"

CUPCAKE_DATA_1 = {
    "flavor": "TestFlavor1",
    "size": "TestSize1",
    "rating": 5,
    "image": "http://test.com/cupcake1.jpg"
}

CUPCAKE_DATA_2 = {
    "flavor": "TestFlavor2",
    "size": "TestSize2",
    "rating": 10,
    "image": "http://test.com/cupcake2.jpg"
}

CUPCAKE_DATA_3 = {
    "flavor": "TestFlavor3",
    "size": "TestSize3",
    "rating": 15,
    "image": "http://test.com/cupcake3.jpg"
}

class CupcakeViewsTestCase(TestCase):
    """Tests for views of API."""

    def setUp(self):
        """Make demo data."""

        Cupcake.query.delete()

        cupcake1 = Cupcake(**CUPCAKE_DATA_1)
        cupcake2 = Cupcake(**CUPCAKE_DATA_2)
        db.session.add(cupcake1)
        db.session.add(cupcake2)
        db.session.commit()

        self.cupcake1 = cupcake1
        self.cupcake2 = cupcake2

    def tearDown(self):
        """Clean up fouled transactions."""

        db.session.rollback()

    def test_list_cupcakes(self):
        with app.test_client() as client:
            resp = client.get(CUPCAKE_API_PATH)
            self.assertEqual(resp.status_code, 200)
            print(resp.json)
            self.assertEqual(resp.json, {
                "cupcakes": [
                    {
                        "id": self.cupcake1.id,
                        "flavor": "TestFlavor1",
                        "size": "TestSize1",
                        "rating": 5,
                        "image": "http://test.com/cupcake1.jpg"
                    },
                    {
                        "id": self.cupcake2.id,
                        "flavor": "TestFlavor2",
                        "size": "TestSize2",
                        "rating": 10,
                        "image": "http://test.com/cupcake2.jpg"
                    }
                ]
            })

    def test_search_cupcakes(self):
        with app.test_client() as client:
            resp = client.get(CUPCAKE_API_PATH + "/search/Flavor2")
            self.assertEqual(resp.status_code, 200)
            print(resp.json)
            self.assertEqual(len(resp.json["cupcakes"]), 1)
            self.assertEqual(resp.json["cupcakes"][0]["flavor"], "TestFlavor2")

    def test_get_cupcake(self):
        with app.test_client() as client:
            resp = client.get(f"{CUPCAKE_API_PATH}/{self.cupcake1.id}")
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json, {
                "cupcake": {
                    "id": self.cupcake1.id,
                    "flavor": "TestFlavor1",
                    "size": "TestSize1",
                    "rating": 5,
                    "image": "http://test.com/cupcake1.jpg"
                }
            })

    def test_get_cupcake_404(self):
        with app.test_client() as client:
            resp = client.get(f"{CUPCAKE_API_PATH}/404")
            self.assertEqual(resp.status_code, 404)

    def test_create_cupcake(self):
        with app.test_client() as client:
            resp = client.post(CUPCAKE_API_PATH, json=CUPCAKE_DATA_3)
            self.assertEqual(resp.status_code, 201)

            # Don't know what ID we'll get, make sure it's an int & normalize
            self.assertIsInstance(resp.json['cupcake']['id'], int)
            del resp.json['cupcake']['id']

            self.assertEqual(resp.json, {
                "cupcake": {
                    "flavor": "TestFlavor3",
                    "size": "TestSize3",
                    "rating": 15,
                    "image": "http://test.com/cupcake3.jpg"
                }
            })

            self.assertEqual(Cupcake.query.count(), 3)

    def test_update_cupcake(self):
        with app.test_client() as client:
            self.cupcake1.flavor = "YummyFlavor"
            self.cupcake1.size = "Nano"
            self.cupcake1.rating = 2
            resp = client.patch(f"{CUPCAKE_API_PATH}/{self.cupcake1.id}", json=self.cupcake1.serialize())
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json, {
                "cupcake": {
                    "id": self.cupcake1.id,
                    "flavor": "YummyFlavor",
                    "size": "Nano",
                    "rating": 2,
                    "image": "http://test.com/cupcake1.jpg"
                }
            })

    def test_update_cupcake_404(self):
        with app.test_client() as client:
            resp = client.patch(f"{CUPCAKE_API_PATH}/404", json=self.cupcake1.serialize())
            self.assertEqual(resp.status_code, 404)

    def test_delete_cupcake(self):
        with app.test_client() as client:
            resp = client.delete(f"{CUPCAKE_API_PATH}/{self.cupcake1.id}")
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.json["deleted"])
            self.assertEqual(resp.json["cupcake"]["id"], self.cupcake1.id)

    def test_delete_cupcake_404(self):
        with app.test_client() as client:
            resp = client.delete(f"{CUPCAKE_API_PATH}/404")
            self.assertEqual(resp.status_code, 404)
