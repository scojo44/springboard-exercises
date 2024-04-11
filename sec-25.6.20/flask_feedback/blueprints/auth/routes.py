from flask import redirect, render_template, flash, session
from ...models import User
from ...forms import RegisterForm, LoginForm
from . import bp

@bp.route("/register", methods=["GET", "POST"])
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
            return render_template("user/register.html.jinja", form=form)

        if signup.save():
            session["username"] = signup.username
            flash("Welcome!", "success")
            return redirect(f"/users/{signup.username}")
        else:
            flash("Error registering new user: " + signup.get_last_error(), "danger")

    return render_template("user/register.html.jinja", form=form)

@bp.route("/login", methods=["GET", "POST"])
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

    return render_template("user/login.html.jinja", form=form)

@bp.post("/logout")
def logout_user():
    session.pop("username")
    flash("You have logged out.  Thanks for playing!", "success")
    return redirect("/")
