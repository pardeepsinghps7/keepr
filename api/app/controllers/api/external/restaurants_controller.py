from flask import jsonify, request
import requests
import os

def get_all_restaurants():

    name = request.args.get("name", "").strip()

    if not name:
        return jsonify({"status": False, "error": "Name is required"}), 400
    
    url = "https://api.foursquare.com/v3/places/search"

    params = {
        "query": name,
        "categories": "4d4b7105d754a06374d81259",
    }


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

        # return response_data

        # Extract restaurant names and locations
        restaurants = [
            {
                "name": item.get("name", "Unknown Name"),
                "location": item.get("location", {})
            }
            for item in results
        ]
        
        return jsonify({"status": True, "data": restaurants}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500



