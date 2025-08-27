import os
import csv
import json
import re
from flask import request, jsonify
from supabase import create_client, Client

# Setup Supabase client (service role or env)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Valid columns from your schema
VALID_COLUMNS = {
    "id", "list_id", "user_id", "title", "status", "rating", "save_for_later",
    "recommended_by", "notes", "author", "podcast_type", "location", "year",
    "image_url", "brewery", "created_at", "episode_title", "series_title",
    "updated_at", "master_id", "client_id", "raw_json"
}

# Build a normalized->actual map so we can match headers case-insensitively
def normalize_key(key: str) -> str:
    if key is None:
        return ""
    k = key.strip()
    # camelCase -> snake_case
    k = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", k)
    # spaces/dashes -> underscores, lowercase
    k = k.replace("-", "_").replace(" ", "_").lower()
    return k

SCHEMA_MAP = {normalize_key(col): col for col in VALID_COLUMNS}

def read_csv_and_print_from_file(file_storage):
    try:
        stream = file_storage.stream.read().decode("utf-8").splitlines()
        reader = csv.DictReader(stream)  # keep original headers
        return list(reader)
    except Exception as e:
        print("Error reading CSV:", e)
        return None

def coerce_value(col: str, value):
    """Optional light coercion for a few columns."""
    if value == "" or value is None:
        return None
    if col == "rating":
        try:
            return int(value)
        except Exception:
            return None
    if col == "save_for_later":
        if isinstance(value, bool):
            return value
        v = str(value).strip().lower()
        return v in ("1", "true", "yes", "y")
    return value

def read_csv_api():
    try:
        if "file" not in request.files:
            return jsonify({"status": False, "error": "Missing file"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"status": False, "error": "Empty filename"}), 400

        rows = read_csv_and_print_from_file(file)
        if rows is None:
            return jsonify({"status": False, "error": "Could not read file"}), 500

        body_user_id = request.form.get("user_id")

        # get list_id where label = 'Books'
        list_result = supabase.table("lists").select("id").eq("label", "Books").single().execute()
        if not list_result.data:
            return jsonify({"status": False, "error": "No list found with label 'Books'"}), 400
        list_id = list_result.data["id"]

        inserted_ids = []
        skipped_isbns = []
        skipped_no_title = 0
        valid_title_found = False

        for row in rows:
            matched = {}
            unmatched = {}

            for orig_key, val in row.items():
                norm = normalize_key(orig_key)
                if norm in SCHEMA_MAP:
                    actual_col = SCHEMA_MAP[norm]
                    if actual_col in ("list_id", "raw_json", "user_id"):
                        continue
                    matched[actual_col] = coerce_value(actual_col, val)
                else:
                    unmatched[orig_key] = val

            # ❌ skip if no title
            if not matched.get("title") or str(matched.get("title")).strip() == "":
                skipped_no_title += 1
                continue

            valid_title_found = True  # ✅ at least one row has title

            matched["list_id"] = list_id
            if body_user_id:
                matched["user_id"] = body_user_id
            if not matched.get("status"):
                matched["status"] = "to_read"
            if unmatched:
                matched["raw_json"] = unmatched

            # 🔹 ISBN uniqueness check
            isbn_val = row.get("ISBN") or row.get("isbn")
            if isbn_val:
                try:
                    existing = supabase.table("items").select("id").filter("raw_json->>ISBN", "eq", isbn_val).execute()
                    if existing.data:
                        skipped_isbns.append(isbn_val)
                        continue
                except Exception as e:
                    print("Error checking ISBN uniqueness:", e)

            result = supabase.table("items").insert(matched).execute()
            if result.data:
                inserted_ids.append(result.data[0]["id"])

        # ❌ if no record had title at all
        if not valid_title_found:
            return jsonify({"status": False, "error": "Invalid records: no row contains title"}), 400

        return jsonify({
            "status": True,
            "inserted_ids": inserted_ids,
            "skipped_isbns": skipped_isbns,
            "skipped_no_title": skipped_no_title,
            "count_inserted": len(inserted_ids),
            "count_skipped_isbns": len(skipped_isbns),
            "count_skipped_no_title": skipped_no_title,
            "message": "CSV uploaded successfully"
        }), 200

    except Exception as e:
        return jsonify({"status": False, "error": str(e)}), 500
