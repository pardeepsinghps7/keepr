from flask import Blueprint, jsonify
from ..controllers.api.external.movies_controller import get_all_movies
from ..controllers.api.external.books_controller import get_all_books
from ..controllers.api.external.tv_shows_controller import get_all_tv_shows

api = Blueprint("api", __name__)

@api.route('/', methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the API Documentation!"})

@api.route('/get-movies', methods=["GET"])
def getMovies():
    return get_all_movies()

@api.route('get-books', methods=["GET"])
def getBooks():
    return get_all_books()

@api.route('get-tv-shows', methods=["GET"])
def getTvShows():
    return get_all_tv_shows()


