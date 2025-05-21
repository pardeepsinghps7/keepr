from app import create_app
import os

app = create_app()

if __name__ == "__main__":

    # app.run(port=3027,debug=True)
    # app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    app.run(
        host=os.getenv("FLASK_RUN_HOST", "0.0.0.0"),
        port=int(os.getenv("FLASK_RUN_PORT", 5000)),
        debug=os.getenv("FLASK_DEBUG", "False").lower() == "true"
    )
 