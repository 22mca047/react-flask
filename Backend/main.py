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
    CORS(app)
    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)
    api = Api(app, doc='/docs') 
    api.add_namespace(recipe_ns)
    api.add_namespace(auth_ns)

    frontend_folder = os.path.join(os.getcwd(),"..","client")
    dist_folder = os.path.join(frontend_folder,"build")

    @app.route("/", defaults={"filename":""})
    @app.route("/<path:filename>")
    def index(filename):
        if not filename:
            filename = "index.html"
        return send_from_directory(dist_folder, filename)

    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db, 
            'Recipe': Recipe,
            'user': User
        }

    return app

