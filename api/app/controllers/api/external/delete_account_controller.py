import os
from flask import jsonify, json, request
from supabase import create_client, Client
import requests

# Set the Supabase URL and Token
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def delete_account():
    try:
        data = request.get_json()
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"status": False, "error": "Missing user_id"}), 400

        # 1. Call the RPC to delete related data from other tables
        try:
            rpc_response = supabase.rpc("delete_user_data", {"uid": user_id}).execute()
            print("User-related data deleted:", rpc_response.data)
        except Exception as e:
            return jsonify({"status": False, "error": f"Failed: {e}"}), 500

        # 2. Delete the user from Supabase Auth
        try:
            admin = supabase.auth.admin
            response = admin.delete_user(user_id)
        except Exception as e:
            return jsonify({"status": False, "error": f"Auth delete failed: {e}"}), 500

        return jsonify({"status": True, "message": "User and all related data deleted"}), 200

    except Exception as e:
        return jsonify({"status": False, "error": str(e)}), 500