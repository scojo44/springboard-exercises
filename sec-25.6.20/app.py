from flask import Flask, redirect, render_template, request, session, flash
from flask_debugtoolbar import DebugToolbarExtension
from werkzeug.exceptions import Unauthorized
from models import connect_db, User, Feedback
from forms import LoginForm, RegisterForm, FeedbackForm, DeleteForm

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql:///feedback'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SECRET_KEY"] = "FlaskDebugTB-Key-751xyi"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
toolbar = DebugToolbarExtension(app)

connect_db(app)

#######################################
# Home Routes
@app.route("/")
def go_home():
    """Show the home page."""
    return redirect("/login")

@app.errorhandler(401)
def show_unauthorized(e):
    return render_template("errors/401.html.jinja"), 404

@app.errorhandler(404)
def show_not_found(e):
    return render_template("errors/404.html.jinja"), 404

#######################################
# Authentication Routes
@app.route("/register", methods=["GET", "POST"])
def register_user():
    """Register a new user."""
    form = RegisterForm()

    if session.get("username"):
        return redirect(f"/users/{session.get('username')}")

    if(form.validate_on_submit()):
        signup = None
        try:
            signup = User.register(username=form.username.data, password=form.password.data, email=form.email.data, first=form.first_name.data, last=form.last_name.data, is_admin=form.is_admin.data)
        except Exception as error:
            form.username.errors.append(error.args[0])
            return render_template("register.html.jinja", form=form)

        if signup.save():
            session["username"] = signup.username
            flash("Welcome!", "success")
            return redirect(f"/users/{signup.username}")
        else:
            flash("Error registering new user: " + signup.get_last_error(), "danger")

    return render_template("register.html.jinja", form=form)

@app.route("/login", methods=["GET", "POST"])
def login_user():
    """Login a user and show the secret page."""
    form = LoginForm()

    if session.get("username"):
        return redirect(f"/users/{session.get('username')}")

    if(form.validate_on_submit()):
        user = User.authenticate(form.username.data, form.password.data)
        if user:
            session["username"] = user.username
            flash("Welcome back!", "success")
            return redirect(f"/users/{user.username}")
        else:
            form.username.errors.append("Incorrect username and/or password.")

    return render_template("login.html.jinja", form=form)

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("username")
    flash("You have logged out.  Thanks for playing!", "success")
    return redirect("/")

#######################################
# User Routes
@app.route("/users/<username>")
def show_user(username):
    """Display a user's info and feedback."""
    user_logged_in = get_logged_in_user()
    form = DeleteForm()

    if user_logged_in:
        user = User.query.get_or_404(username)
        return render_template("user_show.html.jinja", form=form, user=user, admin_logged_in=user_logged_in.is_admin)
    else:
        flash("You must be logged in to view user info.", "danger")
        return redirect("/login")

@app.route("/users/<username>/delete", methods=["POST"])
def delete_user(username):
    """Delete the user and redirect depending on the type user."""
    user_logged_in = get_logged_in_user()
    user_to_delete = User.query.get_or_404(username)
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

@app.route("/secret")
def show_secret():
    """Test page to confirm login works."""
    if session.get("username"):
        return render_template("secret.html.jinja")
    return redirect("/login")

def get_logged_in_user():
    """Helper function to get the logged in user."""
    return User.query.get(session.get("username"))

#######################################
# Feedback Routes
@app.route("/users/<username>/feedback/add", methods=["GET", "POST"])
def add_feedback(username):
    """Show the add feedback form and record the user's feedback."""
    user_logged_in = get_logged_in_user()
    user_with_fb = User.query.get_or_404(username)

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
            return render_template("feedback_add.html.jinja", user=user_with_fb, form=form)

    elif not user_logged_in:
        flash("You must be logged in to do that.", "danger")
        return redirect("/login")
    else: # Send them to their own add feedback page
        return redirect(f"/users/{session.get('username')}/feedback/add")

@app.route("/feedback/<int:id>/update", methods=["GET", "POST"])
def update_feedback(id):
    """Show the update feedback form and save the updated feedback."""
    user_logged_in = get_logged_in_user()
    fb = Feedback.query.get_or_404(id)

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
            return render_template("feedback_update.html.jinja", user=fb.user, form=form)

    elif not user_logged_in:
        flash("You must be logged in to do that.", "danger")
        return redirect("/login")
    else: # Send them to their own user page
        return redirect(f"/users/{session.get('username')}")

@app.route("/feedback/<int:id>/delete", methods=["POST"])
def delete_feedback(id):
    """Delete the unwanted feedback."""
    user_logged_in = get_logged_in_user()
    fb = Feedback.query.get_or_404(id)
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
