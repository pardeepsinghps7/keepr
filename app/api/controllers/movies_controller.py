from flask import jsonify,request
import os,requests,json

TMDB_BEARER_TOKEN = os.environ.get("TMDB_API_KEY")
def get_all_movies():

    title = request.args.get("title")  
    page = request.args.get("page") 
    

    url = f"https://api.themoviedb.org/3/search/movie?query={title}&include_adult=false&language=en-US&page={page}"

    # return url

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_BEARER_TOKEN}"
    }

    try:
        response = requests.get(url, headers=headers)

        response_data = response.json()

        if response_data.get("success") == False:
            return jsonify({"status": False, "error": response_data.get("status_message")	})
        
        data = [movie['title'] for movie in response_data.get("results", [])]

        return jsonify({"status": True,"data": data})
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}),500
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid response from TMDb API"}), 500