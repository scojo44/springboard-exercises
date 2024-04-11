from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, TextAreaField, SelectField, URLField, FileField
from wtforms.validators import InputRequired, URL, NumberRange, AnyOf, Optional
from .models import known_species

class CommonPetFields(FlaskForm):
    """Fields common to both Add and Edit Pet forms."""
    photo_url = URLField("Photo URL:", validators=[Optional(), URL()])
    notes = TextAreaField("Notes:", validators=[Optional()])

class AddPetForm(CommonPetFields):
    """Form for entering pet info."""
    name = StringField("Pet name:", validators=[InputRequired("Please enter the pet's name")])
    species = SelectField("Species:", choices=known_species, validators=[AnyOf(values=known_species, message="Please choose a species from the dropdown list")])
    age = IntegerField("Age:", validators=[Optional(), NumberRange(min=0, max=30, message="Age must be between %(min) and %(max)")])

class EditPetForm(CommonPetFields):
    """Form for editing some pet info."""
    available = BooleanField("Available?")
