from flask import jsonify, request
import os
import requests


def get_all_movies():
    """Fetch movies from TMDb based on the title and page number."""
    
    # Get query parameters
    title = request.args.get("title", "").strip()
    page = request.args.get("page", "1").strip()
    
    # Validate input
    if not title:
        return jsonify({"status": False, "error": "Title is required"}), 400
    
    # Build TMDb API URL
    url = f"https://api.themoviedb.org/3/search/movie"
    params = {
        "query": title,
        "include_adult": "false",
        "language": "en-US",
        "page": page
    }
    
    # Prepare headers
    tmdb_api_key = os.environ.get("TMDB_API_KEY")
    if not tmdb_api_key:
        return jsonify({"status": False, "error": "TMDB API key not set"}), 500
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {tmdb_api_key}"
    }

    try:
        # Make the API request
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for 4xx/5xx errors
        response_data = response.json()

        # return response_data

        # Check for TMDb-specific errors
        if response_data.get("success") == False:
            return jsonify({"status": False, "error": response_data.get("status_message")}), 400
        
        # Extract movie titles
        data = [{"client_id" : movie.get('id'), "release_date" : movie.get('release_date'),"title": movie.get("title", "")} for movie in response_data.get("results", [])]

        return jsonify({"status": True, "data": data}), 200
    
    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500
    
    except ValueError:
        return jsonify({"status": False, "error": "Invalid response from TMDb API"}), 500
