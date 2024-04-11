from flask import render_template
from ...models import db, Post
from . import bp

@bp.get("/")
def show_recent_posts():
    select = db.select(Post).order_by(Post.created_at.desc()).limit(5)
    recent = Post.get_all(select)
    return render_template("index.html.jinja", posts=recent)

@bp.app_errorhandler(404)
def show_not_found(e):
    return render_template("errors/404.html.jinja"), 404
