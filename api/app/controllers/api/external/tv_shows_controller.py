from flask import jsonify, request
import requests

def get_all_tv_shows():

    title = request.args.get("title", "").strip()

    if not title:
        return jsonify({"status": False, "error": "Title is required"}), 400
    
    url = f"https://api.tvmaze.com/search/shows"

    params = {
        "q": title,
    }

    print(params)

    try:

        # Fetch data from TVMaze API
        response = requests.get(url, params=params)
        response.raise_for_status()
        response_data = response.json()

        shows = []

        for item in response_data:
            show = item.get('show')
            title = show.get("name", "Unknown Title")
            shows.append({
                "title" : title
            })
        
        return jsonify({"status": True, "data": shows}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500



