from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, URLField
from wtforms.validators import InputRequired, URL, Optional, Length, NumberRange

class CupcakeForm(FlaskForm):
    """Form for adding a yummy cupcake."""
    flavor = StringField("Flavor:", validators=[InputRequired(), Length(max=30)])
    size = StringField("Size:", validators=[InputRequired(), Length(max=30)])
    rating = FloatField("Rating:", validators=[InputRequired(), NumberRange(min=0, max=5)])
    image = URLField("Image URL:", validators=[Optional(), URL()])

class SearchCupcakesForm(FlaskForm):
    """Form for filtering the cupcake list."""
    query = StringField("Search flavors:")