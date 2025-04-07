from flask import Flask, send_from_directory
from flask_restx import Api
from models import Recipe, User
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from recipes import recipe_ns
from auth import auth_ns
from flask_cors import CORS
import os

def create_app(config):
    app = Flask(__name__, static_folder="../client/public", template_folder="../client/public")
    app.config.from_object(config)
    CORS(app)
    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)
    api = Api(app, doc='/docs') 
    api.add_namespace(recipe_ns)
    api.add_namespace(auth_ns)


    @app.route("/", defaults={"filename": "index.html"})
    @app.route("/<path:filename>")
    def serve_react(filename):
        return send_from_directory(app.static_folder, filename)

    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db, 
            'Recipe': Recipe,
            'User': User
        }

    return app
