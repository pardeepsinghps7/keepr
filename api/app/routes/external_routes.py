from flask import Blueprint, jsonify
from ..controllers.api.external.supabase_controller import test_supabase
from ..controllers.api.external.delete_account_controller import delete_account
from ..controllers.api.external.movies_controller import get_all_movies
from ..controllers.api.external.bourbons_controller import get_all_bourbons
from ..controllers.api.external.wines_controller import get_all_wines
from ..controllers.api.external.books_controller import get_all_books
from ..controllers.api.external.tv_shows_controller import get_all_tv_shows
from ..controllers.api.external.podcasts_controller import get_all_podcasts
from ..controllers.api.external.podcasts_controller import get_all_episodes
from ..controllers.api.external.restaurants_controller import get_all_restaurants
from ..controllers.api.external.beer_controller import get_all_beers

api = Blueprint("api", __name__)

@api.route('/', methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the API Documentation!"})

@api.route('/test-supabase', methods=["GET"])
def testSupabase():
    return test_supabase()

@api.route('/delete-account', methods=["POST"])
def deleteAccount():
    return delete_account()

@api.route('/get-movies', methods=["GET"])
def getMovies():
    return get_all_movies()

@api.route('/get-bourbons', methods=["GET"])
def getBourbons():
    return get_all_bourbons()

@api.route('/get-wines', methods=["GET"])
def getWines():
    return get_all_wines()

@api.route('get-books', methods=["GET"])
def getBooks():
    return get_all_books()

@api.route('get-tv-shows', methods=["GET"])
def getTvShows():
    return get_all_tv_shows()
    

@api.route('get-podcasts', methods=["GET"])
def getPodcasts():
    return get_all_podcasts()

@api.route('get-episodes', methods=["GET"])
def getEpisodes():
    return get_all_episodes()

@api.route('get-restaurants', methods=["GET"])
def getRestaurants():
    return get_all_restaurants()

@api.route('get-beers', methods=['GET'])
def getBeers():
    return get_all_beers()


