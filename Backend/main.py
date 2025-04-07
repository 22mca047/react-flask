import os
from flask import Flask, send_from_directory
from flask_restx import Api
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from exts import db
from models import Recipe, User
from recipes import recipe_ns
from auth import auth_ns

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    # Enable CORS
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # Register namespaces
    api = Api(app, doc='/docs')
    api.add_namespace(recipe_ns)
    api.add_namespace(auth_ns)

    # Path to React build
    build_path = os.path.join(os.path.dirname(__file__), "build")

    @app.route("/", defaults={"filename": "index.html"})
    @app.route("/<path:filename>")
    def serve_frontend(filename):
        return send_from_directory(build_path, filename)

    @app.shell_context_processor
    def shell_context():
        return {"db": db, "Recipe": Recipe, "User": User}

    return app