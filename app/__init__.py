from flask import Flask

def create_app():
    app = Flask(__name__)

    from .routes.external_routes import api
    app.register_blueprint(api, url_prefix="/api")
    
    return app