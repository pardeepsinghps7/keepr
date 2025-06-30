from flask import jsonify, request
import os
import requests


def get_all_podcasts():
    # Get query parameters
    title = request.args.get("title", "").strip()
    page = request.args.get("page", "1").strip()

    # Convert page and set page_size
    try:
        page = int(page)
        if page < 1:
            page = 1
    except ValueError:
        return jsonify({"status": False, "error": "Invalid page number"}), 400

    page_size = 10
    offset = (page - 1) * page_size

    # Validate input
    if not title:
        return jsonify({"status": False, "error": "Title is required"}), 400

    # Build Listen Notes API URL
    url = "https://listen-api.listennotes.com/api/v2/search"
    params = {
        "q": f'"{title}"',
        "type": "podcast",
        "only_in": "title",
        "page_size": page_size,
        "offset": offset,
        "unique_podcasts": 1
    }

    # Prepare headers
    listen_api_key = os.environ.get("LISTEN_NOTES_API_KEY")
    if not listen_api_key:
        return jsonify({"status": False, "error": "API key not set"}), 500

    headers = {
        "accept": "application/json",
        "X-ListenAPI-Key": listen_api_key
    }

    try:
        # Make the API request
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        response_data = response.json()

        # Handle Listen Notes-specific errors
        if response_data.get("success") is False:
            return jsonify({"status": False, "error": response_data.get("status_message")}), 400

        # Extract podcast titles
        data = []
        for result in response_data.get("results", []):
            data.append({
                "client_id": result.get("id"),
                "title": result.get("title_original", ""),
                "publisher": result.get("publisher_original", ""),
            })

        return jsonify({"status": True, "data": data}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500

    except ValueError:
        return jsonify({"status": False, "error": "Invalid response"}), 500


def get_all_episodes():
    # Get query parameters
    title = request.args.get("title", "").strip()
    podcast_id = request.args.get("podcast_id", "").strip()
    page = request.args.get("page", "1").strip()

    # Convert page and set page_size
    try:
        page = int(page)
        if page < 1:
            page = 1
    except ValueError:
        return jsonify({"status": False, "error": "Invalid page number"}), 400

    page_size = 10
    offset = (page - 1) * page_size

    # Validate input
    if not title:
        return jsonify({"status": False, "error": "Title is required"}), 400

    # Build Listen Notes API URL
    url = "https://listen-api.listennotes.com/api/v2/search"
    params = {
        "q": f'"{title}"',  # Exact match with quotes
        "type": "episode",
        "only_in": "title",
        "page_size": page_size,
        "offset": offset,
        "ocid": podcast_id,
    }

    # Prepare headers
    listen_api_key = os.environ.get("LISTEN_NOTES_API_KEY")
    if not listen_api_key:
        return jsonify({"status": False, "error": "API key not set"}), 500

    headers = {
        "accept": "application/json",
        "X-ListenAPI-Key": listen_api_key
    }

    try:
        # Make the API request
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        response_data = response.json()

        if response_data.get("success") is False:
            return jsonify({"status": False, "error": response_data.get("status_message")}), 400

        # Extract episode data
        data = []
        for result in response_data.get("results", []):
            data.append({
                "episode_id": result.get("id"),
                "title": result.get("title_original", ""),
                "podcast_id": result.get("podcast", {}).get("id", ""),
                "podcast_title": result.get("podcast", {}).get("title_original", ""),
                "publisher": result.get("podcast", {}).get("publisher_original", "")
            })

        return jsonify({"status": True, "data": data}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"status": False, "error": str(e)}), 500

    except ValueError:
        return jsonify({"status": False, "error": "Invalid response"}), 500