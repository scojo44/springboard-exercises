"""Flask app for Cupcakes"""
from flask import Flask, request, render_template
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, Cupcake
from forms import CupcakeForm, SearchCupcakesForm

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///cupcakes'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SECRET_KEY"] = "FlaskDebugTB-Key-751xyi"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
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
@app.route(CUPCAKE_API_PATH)
def get_cupcakes():
    cupcakes = Cupcake.query.all()
    return {"cupcakes": [cake.serialize() for cake in cupcakes]}

@app.route(CUPCAKE_API_PATH + "/search/<query>")
def search_cupcakes(query):
    cupcakes = Cupcake.query.filter(Cupcake.flavor.ilike(f"%{query}%")).all()
    return {"query": query, "cupcakes": [cake.serialize() for cake in cupcakes]}

# Read
@app.route(CUPCAKE_API_PATH + "/<int:id>")
def get_cupcake(id):
    cake = Cupcake.query.get_or_404(id)
    return {"cupcake": cake.serialize()}

# Create
@app.route(CUPCAKE_API_PATH, methods=["POST"])
def add_new_cupcake():
    cake_data = {k:v for k,v in request.json.items()}
    new_cake = Cupcake(**cake_data)

    if new_cake.save():
        return {"cupcake": new_cake.serialize()}, 201
    else:
        return {"error": new_cake.get_last_error()}, 500
    
# Update
@app.route(CUPCAKE_API_PATH + "/<int:id>", methods=["PATCH"])
def update_cupcake(id):
    cake = Cupcake.query.get_or_404(id)
    cake.flavor = request.json.get("flavor", cake.flavor)
    cake.size   = request.json.get("size",   cake.size)
    cake.rating = request.json.get("rating", cake.rating)
    cake.image  = request.json.get("image",  cake.image)

    if cake.save():
        return {"cupcake": cake.serialize()}
    else:
        return {"error": cake.get_last_error()}, 500

# Delete
@app.route(CUPCAKE_API_PATH + "/<int:id>", methods=["DELETE"])
def delete_cupcake(id):
    cake = Cupcake.query.get_or_404(id)

    if cake.delete():
        return {"cupcake": cake.serialize(), "deleted": True}
    else:
        return {"error": cake.get_last_error()}, 500
