from flask import Blueprint, render_template, send_file, abort
import os

static_pages = Blueprint('static_pages', __name__)

@static_pages.route('/success')
def success():
    return render_template('success.html')

@static_pages.route('/.well-known/apple-app-site-association', methods=['GET'])
def apple_app_site_association():
    # Adjust path to point directly to project-root/.well-known/apple-app-site-association
    file_path = os.path.join(os.getcwd(), '.well-known', 'apple-app-site-association')

    if os.path.exists(file_path):
        return send_file(file_path, mimetype='application/json')
    else:
        abort(404)
