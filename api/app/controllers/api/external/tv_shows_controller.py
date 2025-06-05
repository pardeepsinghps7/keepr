from flask import jsonify, request
import requests

def get_all_tv_shows():

    name = request.args.get("name", "").strip()

    if not name:
        return jsonify({"status": False, "error": "Name is required"}), 400
    
    url = f"https://api.tvmaze.com/search/shows"

    params = {
        "q": name,
    }


    try:

        # Fetch data from TVMaze API
        response = requests.get(url, params=params)
        response.raise_for_status()
        response_data = response.json()

        shows = []

        for item in response_data:
            show = item.get('show')
            name = show.get("name", "Unknown Name")
            client_id = show.get("id", "")
            shows.append({
                "name" : name,
                "client_id" : client_id
            })
        
        return jsonify({"status": True, "data": shows}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500



