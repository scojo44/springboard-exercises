"""Forms for Flask Feedback"""
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, BooleanField
from wtforms.validators import InputRequired, Email, Length

class LoginForm(FlaskForm):
    """Form for logging into the site."""
    username = StringField("Username:", validators=[InputRequired(), Length(max=20)])
    password = PasswordField("Password:", validators=[InputRequired()])

class RegisterForm(LoginForm):
    """Form for registering a new user."""
    email = EmailField("Email Address:", validators=[InputRequired(), Email(), Length(max=30)])
    first_name = StringField("First Name:", validators=[InputRequired(), Length(max=30)])
    last_name = StringField("Last Name:", validators=[InputRequired(), Length(max=30)])
    is_admin = BooleanField("I'm an admin.  Trust Me!")

class FeedbackForm(FlaskForm):
    """Form for adding or updating feedback posts."""
    title = StringField("Title:", validators=[InputRequired(), Length(max=100)])
    content = StringField("Content:", validators=[InputRequired()])
