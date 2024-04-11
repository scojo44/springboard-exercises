from flask import Blueprint, request, redirect, render_template, flash
from .models import db, User

blogly_bp = Blueprint("blogly_bp", __name__)

@blogly_bp.get("/")
def redirect_to_list():
    return redirect("/users")

@blogly_bp.get("/users")
def list_users():
    users = User.get_all(db.select(User).order_by(User.last_name, User.first_name))
    return render_template("list.html.jinja", users=users)

@blogly_bp.get("/users/new")
def show_new_form():
    return render_template("new.html.jinja")

@blogly_bp.post("/users/new")
def save_new_user():
    (first, last, image) = get_user_form_data(request.form)
    new_user = User(first_name=first, last_name=last, image_url=image)
    if(new_user.save()):
        flash(f"User {new_user.full_name} added successfully", "success")
        return redirect(f"/users/{new_user.id}")
    else:
        flash("Error adding user: " + new_user.get_last_error(), "error")
        return redirect("/users/new")

@blogly_bp.get("/users/<int:id>")
def show_info_form(id):
    return render_template("info.html.jinja", user=User.get_or_404(id))

@blogly_bp.get("/users/<int:id>/edit")
def show_edit_form(id):
    return render_template("edit.html.jinja", user=User.get_or_404(id))

@blogly_bp.post("/users/<int:id>/edit")
def update_user(id):
    user = User.get_or_404(id)
    (user.first_name, user.last_name, user.image_url) = get_user_form_data(request.form)
    if(user.save()):
        flash(f"User {user.full_name} updated successfully", "success")
        return redirect(f"/users/{user.id}")
    else:
        flash("Error updating user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}/edit")

@blogly_bp.post("/users/<int:id>/delete")
def delete_user(id):
    user = User.get_or_404(id)
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