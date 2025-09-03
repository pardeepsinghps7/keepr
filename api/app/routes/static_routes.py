from flask import Blueprint, render_template, send_file, abort, request
import os

static_pages = Blueprint('static_pages', __name__)

@static_pages.route('/error')
def error():
    description = request.args.get('error_description', 'unknown_error')
    return render_template('error.html', error_description=description)

@static_pages.route('/success')
def success():
    access_token = request.args.get('access_token', 'unknown_error')
    refresh_token = request.args.get('refresh_token', 'unknown_error')
    return render_template(
        'success.html',
        access_token=access_token,
        refresh_token=refresh_token
    )

@static_pages.route('/open-app')
def openapp():
    return render_template('open-app.html')

@static_pages.route('/open-app-item/<item_id>')
def openapp_with_item(item_id):
    """
    Handles deep links like:
    https://keeprapi.trigma.in/open-app/abc123
    """
    return render_template('open-app-item.html', item_id=item_id)

@static_pages.route('/.well-known/apple-app-site-association', methods=['GET'])
def apple_app_site_association():
    # Adjust path to point directly to project-root/.well-known/apple-app-site-association
    file_path = os.path.join(os.getcwd(), '.well-known', 'apple-app-site-association')

    if os.path.exists(file_path):
        return send_file(file_path, mimetype='application/json')
    else:
        abort(404)
