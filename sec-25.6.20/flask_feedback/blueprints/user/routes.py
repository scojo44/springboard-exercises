from flask import redirect, render_template, flash, session
from werkzeug.exceptions import Unauthorized
from ...models import User
from ...forms import DeleteForm
from . import bp, get_logged_in_user

@bp.get("/users/<username>")
def show_user(username):
    """Display a user's info and feedback."""
    user_logged_in = get_logged_in_user()
    form = DeleteForm()

    if user_logged_in:
        user = User.get_or_404(username)
        return render_template("user/show.html.jinja", form=form, user=user, admin_logged_in=user_logged_in.is_admin)
    else:
        flash("You must be logged in to view user info.", "danger")
        return redirect("/login")

@bp.post("/users/<username>/delete")
def delete_user(username):
    """Delete the user and redirect depending on the type user."""
    user_logged_in = get_logged_in_user()
    user_to_delete = User.get_or_404(username)
    form = DeleteForm()

    if user_logged_in.username == username or user_logged_in.is_admin:
        if not form.validate_on_submit():
            return Unauthorized()

        if user_to_delete.delete():
            if user_logged_in.is_admin:
                flash(f"User {user_to_delete.username} and their feedback have been deleted.", "success")
                return redirect("/")
            else:
                session.pop("username")
                flash("You have been logged out and your account has been deleted.", "success")
                return redirect("/login")
        else:
            flash(f"Error deleting user {username}: {user_to_delete.get_last_error()}", "danger")
            return redirect(f"/users/{username}")

    elif not user_logged_in:
        flash("You must be logged in to do that.", "danger")
        raise Unauthorized()
        # return redirect("/login")
    else:
        flash("You're not allowed to delete other users!", "danger")
        raise Unauthorized()
        # return redirect(f"/users/{username}")

@bp.get("/secret")
def show_secret():
    """Test page to confirm login works."""
    if session.get("username"):
        return render_template("secret.html.jinja")
    return redirect("/login")
