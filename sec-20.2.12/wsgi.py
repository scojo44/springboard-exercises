from flask_jinja import create_app

app = create_app()

# Start server if run with "python wsgi.py"
if __name__ == "__main__":
    app.run(host="0.0.0.0")