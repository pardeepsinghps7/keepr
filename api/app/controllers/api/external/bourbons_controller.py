from flask import jsonify, request
import os
import requests

def get_all_bourbons():
    """Fetch bourbons from Supabase based on the title and page number."""

    # Get query parameters
    title = request.args.get("title", "").strip()
    page_str = request.args.get("page", "1").strip()

    # Validate input
    if not title:
        return jsonify({"status": False, "error": "Title is required"}), 400

    try:
        page = int(page_str)
        if page < 1:
            raise ValueError
    except ValueError:
        return jsonify({"status": False, "error": "Invalid page number"}), 400

    limit = 10
    offset = (page - 1) * limit

    # Build Supabase API URL
    base_url = os.environ.get("SUPABASE_URL")
    if not base_url:
        return jsonify({"status": False, "error": "API URL not set"}), 500

    # Prepare headers
    api_key = os.environ.get("SUPABASE_TOKEN")

    url = f"{base_url}/rest/v1/bourbons?name=ilike.*{title}*&offset={offset}&limit={limit}&apikey={api_key}"

    if not api_key:
        return jsonify({"status": False, "error": "API key not set"}), 500

    headers = {
        "accept": "application/json",
        "apikey": f"{api_key}"
    }

    try:
        # Make the API request
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        response_data = response.json()

        # Extract item titles
        data = [{"client_id" : item.get('id'), "title": item.get("name", "Unknown Title")} for item in response_data]

        return jsonify({"status": True, "data": data}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500

    except ValueError:
        return jsonify({"status": False, "error": "Invalid response from Supabase API"}), 500
