from flask import render_template
from ...forms import CupcakeForm, SearchCupcakesForm
from . import bp

@bp.route("/")
def go_home():
    return render_template("home.html.jinja", cake_form=CupcakeForm(), filter_form=SearchCupcakesForm())
