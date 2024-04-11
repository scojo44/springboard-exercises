from flask import Blueprint, redirect, render_template, flash
from .models import Pet
from .forms import AddPetForm, EditPetForm

pet_bp = Blueprint("pet_bp", __name__)

@pet_bp.get("/")
def list_pets():
    """List all pets on the home page."""
    return render_template("home.html.jinja", pets=Pet.get_all())

@pet_bp.route("/<int:id>", methods=["GET", "POST"])
def show_pet(id):
    """Show pet details and a form to edit the pet's info.  Also processes the pet update."""
    pet = Pet.get_or_404(id)
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

@pet_bp.route("/add", methods=["GET", "POST"])
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
