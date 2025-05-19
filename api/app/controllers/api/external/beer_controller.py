from flask import jsonify, request
import requests
import os

def get_all_beers():

    name = request.args.get("name", "").strip()

    if not name:
        return jsonify({"status": False, "error": "Name is required"}), 400
    
    url = "https://beer9.p.rapidapi.com/"

    params = {
        "name": name,
    }

    RAPID_BEER_API_KEY = os.environ.get("RAPID_BEER_API_KEY")
    if not RAPID_BEER_API_KEY:
        return jsonify({"status": False, "error": "Rapid API key not set"}), 500

    headers = {
        "x-rapidapi-key": RAPID_BEER_API_KEY,
	    "x-rapidapi-host": "beer9.p.rapidapi.com"
    }


    try:

        # Fetch data from TVMaze API
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        results = response.json().get("data", [])
        

        # Extract restaurant names and locations
        beers = [
            {
                "name": item.get("name", "Unknown Name"),
                "brewery": item.get("brewery", "Unknown Brewery")
            }
            for item in results
        ]
        
        return jsonify({"status": True, "data": beers}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500



