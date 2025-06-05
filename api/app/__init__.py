from flask import Flask

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)

    from .routes.external_routes import api
    from .routes.static_routes import static_pages
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(static_pages)
    
    return app
