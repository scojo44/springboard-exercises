"""Blogly application."""
import os, tomllib
from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User

app = Flask(__name__)
config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
app.config.from_file(config_file, load=tomllib.load, text=False)
debug = DebugToolbarExtension(app)

connect_db(app)

@app.get("/")
def redirect_to_list():
    return redirect("/users")

@app.get("/users")
def list_users():
    users = db.session.scalars(db.select(User).order_by(User.last_name, User.first_name))
    return render_template("list.html", users=users)

@app.get("/users/new")
def show_new_form():
    return render_template("new.html")

@app.post("/users/new")
def save_new_user():
    (first, last, image) = get_user_form_data(request.form)
    new_user = User(first_name=first, last_name=last, image_url=image)
    if(new_user.save()):
        flash(f"User {new_user.full_name} added successfully", "success")
        return redirect(f"/users/{new_user.id}")
    else:
        flash("Error adding user: " + new_user.get_last_error(), "error")
        return redirect("/users/new")

@app.get("/users/<int:id>")
def show_info_form(id):
    user = db.get_or_404(User, id, description="User doesn't exist")
    return render_template("info.html", user=user)

@app.get("/users/<int:id>/edit")
def show_edit_form(id):
    user = db.get_or_404(User, id, description="User doesn't exist")
    return render_template("edit.html", user=user)

@app.post("/users/<int:id>/edit")
def update_user(id):
    user = db.get_or_404(User, id, description="User doesn't exist")
    (user.first_name, user.last_name, user.image_url) = get_user_form_data(request.form)
    if(user.save()):
        flash(f"User {user.full_name} updated successfully", "success")
        return redirect(f"/users/{user.id}")
    else:
        flash("Error updating user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}/edit")

@app.post("/users/<int:id>/delete")
def delete_user(id):
    user = db.get_or_404(User, id)
    if(user.delete()):
        flash(f"User {user.full_name} deleted successfully", "success")
        return redirect(f"/users")
    else:
        flash("Error deleting user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}")

def get_user_form_data(form):
    first = form.get("first")
    last = form.get("last")
    image = form.get("image") or None
    return (first, last, image)