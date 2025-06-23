from flask import jsonify, request
import requests

def fetch_data(url):
    """Fetch data from a given URL and return JSON response."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise Exception(f"Error fetching data: {e}")

def format_books(data, source="open_library"):
    """Format book data based on the source (Open Library or Google Books)."""
    books = []

    if source == "open_library":
        for book in data.get("docs", []):
            title = book.get("title", "Unknown Title")
            author = book.get("author_name", ["Unknown Author"])
            client_id = book.get("key", [""])
            books.append({
                "client_id": client_id,
                "title": title,
                "author": ", ".join(author),
            })
    elif source == "google_books":
        for item in data.get("items", []):
            volume_info = item.get("volumeInfo", {})
            client_id = item.get("id", "")
            title = volume_info.get("title", "")
            author = volume_info.get("authors", [])
            books.append({
                "client_id": client_id,
                "title": title,
                "author": ", ".join(author),
            })

    return books

def get_all_books():
    """Fetch books from Open Library and Google Books if needed."""
    query = request.args.get("title", "").strip()
    page = request.args.get("page", "1").strip()

    if not query:
        return jsonify({"status": False, "message": "Title is required"}), 400

    try:
        # Fetch from Open Library first
        open_library_url = f"https://openlibrary.org/search.json?title='{query}'&page={page}"
        data = fetch_data(open_library_url)
        books = format_books(data, "open_library")

        # Fallback to Google Books if Open Library is empty
        if not books:
            google_books_url = f"https://www.googleapis.com/books/v1/volumes?q={query}"
            data = fetch_data(google_books_url)
            books = format_books(data, "google_books")

        return jsonify({"status": True, "data": books}), 200

    except Exception as e:
        return jsonify({"status": False, "error": str(e)}), 500
