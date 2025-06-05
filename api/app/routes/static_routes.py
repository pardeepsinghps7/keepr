from flask import Blueprint, render_template

static_pages = Blueprint('static_pages', __name__)

@static_pages.route('/success')
def success():
    return render_template('success.html')

