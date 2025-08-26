import os
from flask import jsonify
from supabase import create_client, Client

# Setup Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_item_by_id(item_id: str):
    try:
        if not item_id:
            return jsonify({"status": False, "error": "Missing item_id"}), 400

        # Fetch item + its related list in one go
        result = (
            supabase.table("items")
            .select("*, lists(*)")   # fetch all item cols and the joined list
            .eq("id", item_id)
            .single()
            .execute()
        )

        if not result.data:
            return jsonify({"status": False, "error": "Item not found"}), 404

        return jsonify({"status": True, "item": result.data}), 200

    except Exception as e:
        return jsonify({"status": False, "error": str(e)}), 500
