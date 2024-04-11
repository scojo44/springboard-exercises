from flask import redirect, render_template, flash, session
from werkzeug.exceptions import Unauthorized
from ...models import User, Feedback
from ...forms import FeedbackForm, DeleteForm
from ..user import get_logged_in_user
from . import bp

@bp.route("/users/<username>/feedback/add", methods=["GET", "POST"])
def add_feedback(username):
    """Show the add feedback form and record the user's feedback."""
    user_logged_in = get_logged_in_user()
    user_with_fb = User.get_or_404(username)

    if user_logged_in.username == username or user_logged_in.is_admin:
        form = FeedbackForm()

        if form.validate_on_submit():
            fb = Feedback(title=form.title.data, content=form.content.data, username=username)

            if fb.save():
                flash("Thanks for your feedback!", "success")
                return redirect(f"/users/{fb.username}")
            else:
                flash("Error saving your feedback: " + fb.get_last_error(), "danger")
                return redirect(f"/users/{fb.username}/feedback/add")
        else:
            return render_template("feedback/add.html.jinja", user=user_with_fb, form=form)

    elif not user_logged_in:
        flash("You must be logged in to do that.", "danger")
        return redirect("/login")
    else: # Send them to their own add feedback page
        return redirect(f"/users/{session.get('username')}/feedback/add")

@bp.route("/feedback/<int:id>/update", methods=["GET", "POST"])
def update_feedback(id):
    """Show the update feedback form and save the updated feedback."""
    user_logged_in = get_logged_in_user()
    fb = Feedback.get_or_404(id)

    if user_logged_in.username == fb.username or user_logged_in.is_admin:
        form = FeedbackForm(obj=fb)

        if form.validate_on_submit():
            fb.title = form.title.data
            fb.content = form.content.data

            if fb.save():
                flash("Your feedback was successfully updated.", "success")
                return redirect(f"/users/{fb.username}")
            else:
                flash("Error saving your feedback update: " + fb.get_last_error(), "danger")
                return redirect(f"/feedback/{id}/update")
        else:
            return render_template("feedback/update.html.jinja", user=fb.user, form=form)

    elif not user_logged_in:
        flash("You must be logged in to do that.", "danger")
        return redirect("/login")
    else: # Send them to their own user page
        return redirect(f"/users/{session.get('username')}")

@bp.post("/feedback/<int:id>/delete")
def delete_feedback(id):
    """Delete the unwanted feedback."""
    user_logged_in = get_logged_in_user()
    fb = Feedback.get_or_404(id)
    form = DeleteForm()

    if user_logged_in.username == fb.username or user_logged_in.is_admin:
        if not form.validate_on_submit():
            return Unauthorized()

        if fb.delete():
            flash(f"Feedback '{fb.title}' was successfully deleted.", "success")
        else:
            flash("Error deleting feedback: " + fb.get_last_error(), "danger")

        return redirect(f"/users/{fb.username}")

    elif not user_logged_in:
        flash("You must be logged in to do that.", "danger")
        raise Unauthorized()
        # return redirect("/login")
    else:
        flash("You're not allowed to delete other users' feedback!", "danger")
        raise Unauthorized()
        # return redirect(f"/users/{fb.username}")
