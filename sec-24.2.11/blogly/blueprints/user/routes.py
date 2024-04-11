from flask import request, redirect, render_template, flash
from ...models import db, User
from . import bp

# Show user
@bp.get("/users")
def list_users():
    select = db.select(User).order_by(User.last_name, User.first_name)
    users = User.get_all(select)
    return render_template("user/list.html.jinja", users=users)

@bp.get("/users/<int:id>")
def show_user_info(id):
    user = User.get_or_404(id)
    return render_template("user/show.html.jinja", user=user)

# Create user
@bp.get("/users/new")
def show_new_user_form():
    return render_template("user/new.html.jinja")

@bp.post("/users/new")
def save_new_user():
    (first, last, image) = get_user_form_data(request.form)
    new_user = User(first_name=first, last_name=last, image_url=image)

    if(new_user.save()):
        flash(f"User {new_user.full_name} added successfully", "success")
        return redirect(f"/users/{new_user.id}")
    else:
        flash("Error adding user: " + new_user.get_last_error(), "error")
        return redirect("/users/new")

# Edit user
@bp.get("/users/<int:id>/edit")
def show_edit_user_form(id):
    user = User.get_or_404(id)
    return render_template("user/edit.html.jinja", user=user)

@bp.post("/users/<int:id>/edit")
def update_user(id):
    user = User.get_or_404(id)
    (user.first_name, user.last_name, user.image_url) = get_user_form_data(request.form)

    if(user.save()):
        flash(f"User {user.full_name} updated successfully", "success")
        return redirect(f"/users/{user.id}")
    else:
        flash("Error updating user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}/edit")

# Delete user
@bp.post("/users/<int:id>/delete")
def delete_user(id):
    user = User.get_or_404(id)

    if(user.delete()):
        flash(f"User {user.full_name} deleted successfully", "success")
        return redirect(f"/users")
    else:
        flash("Error deleting user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}")

# Support functions
def get_user_form_data(form):
    first = form.get("first")
    last = form.get("last")
    image = form.get("image") or None
    return (first, last, image)
