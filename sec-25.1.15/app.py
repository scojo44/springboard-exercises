"""WTForms:  Pet Adoption Agency"""
import os, tomllib
from flask import Flask, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Pet
from forms import AddPetForm, EditPetForm

app = Flask(__name__)
config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
app.config.from_file(config_file, load=tomllib.load, text=False)
toolbar = DebugToolbarExtension(app)

connect_db(app)

#######################################
# Routes
@app.get("/")
def list_pets():
    """List all pets on the home page."""
    pets = db.session.scalars(db.select(Pet)).all()
    return render_template("home.html.jinja", pets=pets)

@app.route("/<int:id>", methods=["GET", "POST"])
def show_pet(id):
    """Show pet details and a form to edit the pet's info.  Also processes the pet update."""
    pet = db.get_or_404(Pet, id, description="We don't have that pet")
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