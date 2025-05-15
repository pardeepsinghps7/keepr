from flask import Flask

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)

    from .routes.external_routes import api
    app.register_blueprint(api, url_prefix="/api")
    
    return app