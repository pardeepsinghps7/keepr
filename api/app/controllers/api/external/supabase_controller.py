import os
from flask import jsonify,json
from supabase import create_client, Client
import requests

def test_supabase():

# Set the Supabase URL and Token
    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    try:
        response = supabase.rpc('get_movies_with_user_email').execute()
        users = response.data
        return users

        return jsonify({"status": True, "data": users}), 200

    except Exception as e:
        return jsonify({"status": False, "error": str(e)}), 500

    