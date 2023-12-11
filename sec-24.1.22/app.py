"""Blogly application."""
from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "FlaskDebugTB-Key"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

connect_db(app)

@app.route("/")
def redirect_to_list():
    return redirect("/users")

@app.route("/users")
def list_users():
    users = User.query.order_by(User.last_name, User.first_name).all()
    return render_template("list.html", users=users)

@app.route("/users/new")
def show_new_form():
    return render_template("new.html")

@app.route("/users/new", methods=["POST"])
def save_new_user():
    (first, last, image) = get_user_form_data(request.form)
    new_user = User(first_name=first, last_name=last, image_url=image)
    if(new_user.save()):
        flash(f"User {new_user.full_name} added successfully", "success")
        return redirect(f"/users/{new_user.id}")
    else:
        flash("Error adding user: " + new_user.get_last_error(), "error")
        return redirect("/users/new")

@app.route("/users/<int:id>")
def show_info_form(id):
    user = User.query.get_or_404(id)
    return render_template("info.html", user=user)

@app.route("/users/<int:id>/edit")
def show_edit_form(id):
    user = User.query.get_or_404(id)
    return render_template("edit.html", user=user)

@app.route("/users/<int:id>/edit", methods=["POST"])
def update_user(id):
    user = User.query.get_or_404(id)
    (user.first_name, user.last_name, user.image_url) = get_user_form_data(request.form)
    if(user.save()):
        flash(f"User {user.full_name} updated successfully", "success")
        return redirect(f"/users/{user.id}")
    else:
        flash("Error updating user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}/edit")

@app.route("/users/<int:id>/delete", methods=["POST"])
def delete_user(id):
    user = User.query.get(id)
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