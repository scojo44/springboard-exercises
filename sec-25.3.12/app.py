"""Flask app for Cupcakes"""
import os, tomllib
from flask import Flask, request, render_template
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake
from forms import CupcakeForm, SearchCupcakesForm

app = Flask(__name__)
config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
app.config.from_file(config_file, load=tomllib.load, text=False)
toolbar = DebugToolbarExtension(app)

connect_db(app)

#######################################
# Home Route
@app.route("/")
def go_home():
    return render_template("home.html.jinja", cake_form=CupcakeForm(), filter_form=SearchCupcakesForm())

#######################################
# API Routes
CUPCAKE_API_PATH = "/api/cupcakes"

# List
@app.get(CUPCAKE_API_PATH)
def get_cupcakes():
    return {"cupcakes": [cake.serialize() for cake in Cupcake.get_all()]}

@app.get(CUPCAKE_API_PATH + "/search/<query>")
def search_cupcakes(query):
    select = db.select(Cupcake).where(Cupcake.flavor.ilike(f"%{query}%"))
    cupcakes = Cupcake.get_all(select)
    return {"query": query, "cupcakes": [cake.serialize() for cake in cupcakes]}

# Read
@app.get(CUPCAKE_API_PATH + "/<int:id>")
def get_cupcake(id):
    return {"cupcake": Cupcake.get_or_404(id).serialize()}

# Create
@app.post(CUPCAKE_API_PATH)
def add_new_cupcake():
    cake_data = {k:v for k,v in request.json.items()}
    new_cake = Cupcake(**cake_data)

    if new_cake.save():
        return {"cupcake": new_cake.serialize()}, 201
    else:
        return {"error": new_cake.get_last_error()}, 500
    
# Update
@app.patch(CUPCAKE_API_PATH + "/<int:id>")
def update_cupcake(id):
    cake = Cupcake.get_or_404(id)
    cake.flavor = request.json.get("flavor", cake.flavor)
    cake.size   = request.json.get("size",   cake.size)
    cake.rating = request.json.get("rating", cake.rating)
    cake.image  = request.json.get("image",  cake.image)

    if cake.save():
        return {"cupcake": cake.serialize()}
    else:
        return {"error": cake.get_last_error()}, 500

# Delete
@app.delete(CUPCAKE_API_PATH + "/<int:id>")
def delete_cupcake(id):
    cake = Cupcake.get_or_404(id)

    if cake.delete():
        return {"cupcake": cake.serialize(), "deleted": True}
    else:
        return {"error": cake.get_last_error()}, 500