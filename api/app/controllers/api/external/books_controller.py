from flask import jsonify,request
import requests

def get_all_books():
    
    query = request.args.get("title")  
    page = request.args.get("page") 
    url = f"https://openlibrary.org/search.json?q={query}&page={page}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Return the JSON response
        response_data = response.json()
        books = response_data.get("docs", [])
        
        # Check if the response is not empty
        if not books:
            google_books_url = f"https://www.googleapis.com/books/v1/volumes?q={query}"
            google_response = requests.get(google_books_url)
            google_response.raise_for_status()
            google_data = google_response.json()
            
            # Extract items from Google Books
            items = google_data.get("items", [])
            if not items:
                return jsonify({"status": True,"data": []}), 200
            
            # Format Google Books data
            data = []
            for item in items:
                volume_info = item.get("volumeInfo", {})
                title = volume_info.get("title", "Unknown Title")
                authors = volume_info.get("authors", ["Unknown Author"])
                data.append({
                    "title": title,
                    "authors": ", ".join(authors)
                })
            
            return jsonify({"status": True,"data": data}), 200
        
        # Extract titles and author names
        data = []
        for book in books:
            title = book.get("title", "Unknown Title")
            author_names = book.get("author_name", ["Unknown Author"])
            data.append({
                "title": title,
                "authors": ", ".join(author_names)
            })
        
        # Return the formatted results
        return jsonify({"status": True,"data": data}), 200
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500