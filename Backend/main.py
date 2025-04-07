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
    app = Flask(__name__)
    app.config.from_object(config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)

    # Register API namespaces
    api = Api(app, doc='/docs')
    api.add_namespace(recipe_ns)
    api.add_namespace(auth_ns)

    # Set path to React build directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    react_build_dir = os.path.join(project_root, "client", "build")

    # Serve React static files
    @app.route("/", defaults={"filename": "index.html"})
    @app.route("/<path:filename>")
    def serve_react(filename):
        file_path = os.path.join(react_build_dir, filename)
        if os.path.exists(file_path):
            return send_from_directory(react_build_dir, filename)
        else:
            # fallback to index.html for React Router
            return send_from_directory(react_build_dir, "index.html")

    # Add shell context for Flask CLI
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db, 
            'Recipe': Recipe,
            'user': User
        }

    return app
