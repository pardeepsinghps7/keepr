from flask import jsonify, request
import requests
import os

def get_all_restaurants():

    name = request.args.get("name", "").strip()
    near = request.args.get("near", "").strip()
    latitude = request.args.get("latitude", "").strip()
    longitude = request.args.get("longitude", "").strip()

    if not name:
        return jsonify({"status": False, "error": "Name is required"}), 400
    
    url = "https://api.foursquare.com/v3/places/search"

    params = {
        "query": name,
        "categories": "4d4b7105d754a06374d81259",
        "limit": 50,
    }
    if latitude and longitude:
        params["ll"] = f"{latitude},{longitude}"
        params["radius"] = 100000
    elif near:
        params["near"] = near

    FOUR_SQUARE_API_KEY = os.environ.get("FOUR_SQUARE_API_KEY")
    if not FOUR_SQUARE_API_KEY:
        return jsonify({"status": False, "error": "FOUR SQUARE API key not set"}), 500

    headers = {
        "accept": "application/json",
        "Authorization": FOUR_SQUARE_API_KEY
    }

    try:

        # Fetch data from TVMaze API
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        results = response.json().get("results", [])

        # Extract restaurant names and locations
        restaurants = [
            {
                "name": item.get("name", ""),
                "location": item.get("location", {}),
                "client_id": item.get("fsq_id", "")
            }
            for item in results
        ]
        
        return jsonify({"status": True, "data": restaurants}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500



