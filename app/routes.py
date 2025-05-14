from flask import Blueprint, jsonify
from .api.controllers.movies_controller import get_all_movies

api = Blueprint("api", __name__)

@api.route('/get-movies', methods=["GET"])

def getMovies():
     
    return get_all_movies()