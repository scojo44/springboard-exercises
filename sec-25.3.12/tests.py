import os
os.environ['APP_TEST_CONFIG'] = 'config_test.toml'

from unittest import TestCase
from app import app
from models import db, Cupcake

app.testing = True

# Start with a clean database
with app.app_context():
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
        with app.app_context():
            # Clear the cupcake table
            for cupcake in Cupcake.get_all():
                db.session.delete(cupcake)
            db.session.commit()

            # Add sample cupcakes
            cupcake1 = Cupcake(**CUPCAKE_DATA_1)
            cupcake2 = Cupcake(**CUPCAKE_DATA_2)
            db.session.add(cupcake1)
            db.session.add(cupcake2)
            db.session.commit()

            self.cupcake1_id = cupcake1.id
            self.cupcake2_id = cupcake2.id

    def tearDown(self):
        """Clean up fouled transactions."""
        with app.app_context():
            db.session.rollback()

    def test_list_cupcakes(self):
        with app.test_client() as client:
            resp = client.get(CUPCAKE_API_PATH)
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json, {
                "cupcakes": [
                    {
                        "id": self.cupcake1_id,
                        "flavor": "TestFlavor1",
                        "size": "TestSize1",
                        "rating": 5,
                        "image": "http://test.com/cupcake1.jpg"
                    },
                    {
                        "id": self.cupcake2_id,
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
            self.assertEqual(len(resp.json["cupcakes"]), 1)
            self.assertEqual(resp.json["cupcakes"][0]["flavor"], "TestFlavor2")

    def test_get_cupcake(self):
        with app.test_client() as client:
            resp = client.get(f"{CUPCAKE_API_PATH}/{self.cupcake1_id}")
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json, {
                "cupcake": {
                    "id": self.cupcake1_id,
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
            cake = dict(resp.json)

            # Don't know what ID we'll get, make sure it's an int & normalize
            self.assertIsInstance(resp.json['cupcake']['id'], int)
            del cake['cupcake']['id']
            self.assertDictEqual(cake, {
                "cupcake": {
                    "flavor": "TestFlavor3",
                    "size": "TestSize3",
                    "rating": 15,
                    "image": "http://test.com/cupcake3.jpg"
                }
            })

            self.assertEqual(Cupcake.query.count(), 3)

    def test_update_cupcake(self):
        with app.app_context():
            cake = Cupcake.get(self.cupcake1_id)
            cake.flavor = "YummyFlavor"
            cake.size = "Nano"
            cake.rating = 2

        with app.test_client() as client:
            resp = client.patch(f"{CUPCAKE_API_PATH}/{cake.id}", json=cake.serialize())
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json, {
                "cupcake": {
                    "id": self.cupcake1_id,
                    "flavor": "YummyFlavor",
                    "size": "Nano",
                    "rating": 2,
                    "image": "http://test.com/cupcake1.jpg"
                }
            })

    def test_update_cupcake_404(self):
        with app.app_context():
            cake = Cupcake.get(self.cupcake1_id)
            cake.flavor = "YummyFlavor"

        with app.test_client() as client:
            resp = client.patch(f"{CUPCAKE_API_PATH}/404", json=cake.serialize())
            self.assertEqual(resp.status_code, 404)

    def test_delete_cupcake(self):
        with app.test_client() as client:
            resp = client.delete(f"{CUPCAKE_API_PATH}/{self.cupcake1_id}")
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.json["deleted"])
            self.assertEqual(resp.json["cupcake"]["id"], self.cupcake1_id)

    def test_delete_cupcake_404(self):
        with app.test_client() as client:
            resp = client.delete(f"{CUPCAKE_API_PATH}/404")
            self.assertEqual(resp.status_code, 404)
