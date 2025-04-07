import unittest
from main import create_app
from config import TestConfig
from exts import db

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client(self)

        with self.app.app_context():
            db.create_all()

    def test_hello_world(self):
        hello_response = self.client.get('/recipe/hello')
        json = hello_response.json
        self.assertEqual(json, {"message": "Hello World"})  


    def test_signup(self):
        signup_response = self.client.post(
            '/auth/signup',
            json={
                "username": "test",
                "email": "test@gmail.com",
                "password": "password",
            }
        )

        status_code = signup_response.status_code

        self.assertEqual(status_code, 201)
    
    def test_login(self):
        signup_response = self.client.post(
            '/auth/signup',
            json={
                "username": "test",
                "email": "test@gmail.com",
                "password": "password",
            }
        )

        login_response = self.client.post(
            '/auth/login',
            json={
                "username": "test",
                "password": "password",
            }
        )
        json = login_response.json
        statuscode = login_response.status_code
        self.assertEqual(statuscode, 200)
        
    def test_get_all_recipes(self):
        """TEST GETTING ALL RECIPES"""
        response = self.client.get(
            '/recipe/recipes'
        )

        status_code = response.status_code

        self.assertEqual(status_code, 200)

    def test_get_one_recipes(self):
        """TEST GET RECIPE USING ID"""
        id = 1
        response = self.client.get(
            f'/recipe/recipes/{id}'
        )
        status_code = response.status_code

        self.assertEqual(status_code, 404)

    def test_create_recipes(self):
        """TEST CREATE RECIPE"""
        signup_response = self.client.post(
            '/auth/signup',
            json={
                "username": "test",
                "email": "test@gmail.com",
                "password": "password",
            }
        )

        login_response = self.client.post(
            '/auth/login',
            json={
                "username": "test",
                "password": "password",
            }
        )
        access_token = login_response.json["access_token"]

        create_recipe = self.client.post(
            '/recipe/recipes',
            json={
                "title": "test cookie",
                "description": "test",
            },
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )
        status_code = create_recipe.status_code
        self.assertEqual(status_code, 201)
        

    def test_update_recipes(self):
        """TEST UPDATE RECIPE"""
        signup_response = self.client.post(
            '/auth/signup',
            json={
                "username": "test",
                "email": "test@gmail.com",
                "password": "password",
            }
        )

        login_response = self.client.post(
            '/auth/login',
            json={
                "username": "test",
                "password": "password",
            }
        )
        access_token = login_response.json["access_token"]

        create_recipe = self.client.post(
            '/recipe/recipes',
            json={
                "title": "test cookie",
                "description": "test",
            },
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )

        id = 1
        update_response = self.client.put(
            f'/recipe/recipe/{id}',
            json={
                "title": "test cookie updated",
                "description": "test updated",
            },
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )
        status_code = update_response.status_code
        self.assertEqual(status_code, 200)

    def test_delete_recipes(self):
        """TEST DELETE RECIPE"""
        signup_response = self.client.post(
            '/auth/signup',
            json={
                "username": "test",
                "email": "test@gmail.com",
                "password": "password",
            }
        )

        login_response = self.client.post(
            '/auth/login',
            json={
                "username": "test",
                "password": "password",
            }
        )
        access_token = login_response.json["access_token"]

        create_recipe = self.client.post(
            '/recipe/recipes',
            json={
                "title": "test cookie",
                "description": "test",
            },
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )
        recipe_id = create_recipe.json["id"]
        delete_response = self.client.delete(
            f'recipe/recipe/{recipe_id}',
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )
        status_code = delete_response.status_code
        self.assertEqual(status_code, 200)

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

if __name__ == "__main__":
    unittest.main()