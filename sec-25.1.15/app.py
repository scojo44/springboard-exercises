"""WTForms:  Pet Adoption Agency"""
from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, Pet
from forms import AddPetForm, EditPetForm

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///adoptpets'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SECRET_KEY"] = "FlaskDebugTB-Key-751xyi"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
toolbar = DebugToolbarExtension(app)

connect_db(app)

#######################################
# Routes
@app.route("/")
def list_pets():
    """List all pets on the home page."""
    return render_template("home.html.jinja", pets=Pet.query.all())

@app.route("/<int:id>", methods=["GET", "POST"])
def show_pet(id):
    """Show pet details and an for to edit the pet's info.  Also processes the pet update."""
    pet = Pet.query.get_or_404(id)
    form = EditPetForm(obj=pet)

    if form.validate_on_submit():
        pet.photo_url = form.photo_url.data,
        pet.notes = form.notes.data,
        pet.available = form.available.data

        if pet.save():
            flash(f"Pet {pet.name} updated successfully", "text-success")
        else:
            flash(f"Error updating pet: {pet.get_last_error()}", "text-danger")
        return redirect(f"/{pet.id}")
    else:
        return render_template("pet_show.html.jinja", pet=pet, form=form)

@app.route("/add", methods=["GET", "POST"])
def add_pet():
    """Show a form to add a new pet and process the submission."""
    form = AddPetForm()

    if form.validate_on_submit():
        pet_data = {k:v for k,v in form.data.items() if k != "csrf_token"}
        new_pet = Pet(**pet_data)

        if new_pet.save():
            flash(f"Pet {new_pet.name} added successfully", "text-success")
            return redirect("/")
        else:
            flash(f"Error adding pet: {new_pet.get_last_error()}", "text-danger")
            return redirect("/add")
    else:
        return render_template("/pet_add_form.html.jinja", form=form)