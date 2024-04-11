from flask import redirect, render_template
from . import bp

@bp.get("/")
def go_home():
    """Show the home page."""
    return redirect("/login")

@bp.errorhandler(401)
def show_unauthorized(e):
    return render_template("errors/401.html.jinja"), 404

@bp.errorhandler(404)
def show_not_found(e):
    return render_template("errors/404.html.jinja"), 404
