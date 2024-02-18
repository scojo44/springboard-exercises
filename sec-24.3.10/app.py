"""Blogly application."""
import os, tomllib
from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Post, Tag

app = Flask(__name__)
config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
app.config.from_file(config_file, load=tomllib.load, text=False)
debug = DebugToolbarExtension(app)

connect_db(app)

#######################################
# Home routes

@app.get("/")
def show_recent_posts():
    select = db.select(Post).order_by(Post.created_at.desc()).limit(5)
    recent = Post.get_all(select)
    return render_template("index.html.jinja", posts=recent)

@app.errorhandler(404)
def show_not_found(e):
    return render_template("errors/404.html.jinja"), 404

#######################################
# User routes

# Show user
@app.get("/users")
def list_users():
    select = db.select(User).order_by(User.last_name, User.first_name)
    return render_template("user_list.html.jinja", users=User.get_all(select))

@app.get("/users/<int:id>")
def show_user(id):
    return render_template("user_show.html.jinja", user=User.get_or_404(id))

# Create user
@app.get("/users/new")
def show_new_user_form():
    return render_template("user_new.html.jinja")

@app.post("/users/new")
def save_new_user():
    first, last, image = get_user_form_data(request.form)
    new_user = User(first_name=first, last_name=last, image_url=image)
    select = db.select(User).where(User.first_name == first, User.last_name == last)
    existing_user = User.get_first(select)

    if existing_user:
        flash(f"User {new_user} already exists.  Here it is.", "error")
        return redirect(f"/users/{existing_user.id}")

    if new_user.save():
        flash(f"User {new_user.full_name} added successfully", "success")
        return redirect(f"/users/{new_user.id}")
    else:
        flash("Error adding user: " + new_user.get_last_error(), "error")
        return redirect("/users/new")

# Edit user
@app.get("/users/<int:id>/edit")
def show_edit_user_form(id):
    return render_template("user_edit.html.jinja", user=User.query.get_or_404(id))

@app.post("/users/<int:id>/edit")
def update_user(id):
    user = User.get_or_404(id)
    user.first_name, user.last_name, user.image_url = get_user_form_data(request.form)

    if user.save():
        flash(f"User {user.full_name} updated successfully", "success")
        return redirect(f"/users/{user.id}")
    else:
        flash("Error updating user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}/edit")

# Delete user
@app.post("/users/<int:id>/delete")
def delete_user(id):
    user = User.get_or_404(id)

    if user.delete():
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

#######################################
# Post routes

# Show post
@app.get("/posts/<int:id>")
def show_post(id):
    return render_template("post_show.html.jinja", post=Post.get_or_404(id))

# Create post
@app.get("/users/<int:user_id>/posts/new")
def show_new_post_form(user_id):
    return render_template("post_new.html.jinja", user=User.get_or_404(id), tags=Tag.get_all())

@app.post("/users/<int:user_id>/posts/new")
def save_new_post(user_id):
    title, content = get_post_form_data(request.form)
    new_post = Post(title=title, content=content, user_id=user_id)
    select = db.select(Tag).where(Tag.id.in_(request.form.getlist("tags")))
    new_post.tags = Tag.get_all(select)

    if new_post.save():
        flash(f"Post '{new_post.title}' added successfully", "success")
        return redirect(f"/posts/{new_post.id}")
    else:
        flash("Error adding post: " + new_post.get_last_error(), "error")
        return redirect(f"/users/{user_id}/posts/new")

# Edit post
@app.get("/posts/<int:id>/edit")
def show_edit_post_form(id):
    return render_template("post_edit.html.jinja", post=Post.get_or_404(id), tags=Tag.get_all())

@app.post("/posts/<int:id>/edit")
def update_post(id):
    post = Post.get_or_404(id)
    post.title, post.content = get_post_form_data(request.form)
    select = db.select(Tag).where(Tag.id.in_(request.form.getlist("tags")))
    post.tags = Tag.get_all(select)

    if post.save():
        flash(f"Post '{post.title}' updated successfully", "success")
        return redirect(f"/posts/{post.id}")
    else:
        flash("Error updating post: " + post.get_last_error(), "error")
        return redirect(f"/posts/{post.id}/edit")

# Delete post
@app.post("/posts/<int:id>/delete")
def delete_post(id):
    post = Post.get_or_404(id)

    if post.delete():
        flash(f"Post '{post.title}' deleted successfully", "success")
        return redirect(f"/users/{post.user_id}")
    else:
        flash("Error deleting post: " + post.get_last_error(), "error")
        return redirect(f"/posts/{post.id}")

# Support functions
def get_post_form_data(form):
    title = form.get("title")
    content = form.get("content")
    return (title, content)

#######################################
# Tag routes

# Show tag
@app.get("/tags/<int:id>")
def show_tag(id):
    return render_template("tag_show.html.jinja", tag=Tag.get_or_404(id))

@app.get("/tags")
def list_tags():
    return render_template("tag_list.html.jinja", tags=Tag.get_all())

# Create tag
@app.get("/tags/new")
def show_new_tag_form():
    return render_template("tag_new.html.jinja", posts=Post.get_all())

@app.post("/tags/new")
def save_new_tag():
    new_tag = Tag(name=request.form.get("name"))
    select = db.select(Tag).where(Tag.name == new_tag.name)
    existing_tag = Tag.get_first(select)

    if existing_tag:
        flash(f"Tag '{new_tag}' already exists.  Here it is.", "error")
        return redirect(f"/tags/{existing_tag.id}")

    select = db.select(Post).where(Post.id.in_(request.form.getlist("posts")))
    new_tag.posts = Post.get_all(select)

    if new_tag.save():
        flash(f"Tag '{new_tag.name}' added successfully", "success")
        return redirect(f"/tags/{new_tag.id}")
    else:
        flash(f"Error adding tag: {new_tag.get_last_error()}", "error")
        return redirect("/tags/new")

# Edit tag
@app.get("/tags/<int:id>/edit")
def show_edit_tag_form(id):
    return render_template("tag_edit.html.jinja", tag=Tag.get_or_404(id), posts=Post.get_all())

@app.post("/tags/<int:id>/edit")
def update_tag(id):
    tag = Tag.get_or_404(id)
    tag.name = request.form.get("name")
    select = db.select(Post).where(Post.id.in_(request.form.getlist("posts")))
    tag.posts = Post.get_all(select)

    if tag.save():
        flash(f"Tag '{tag.name}' updated successfully", "success")
        return redirect(f"/tags/{id}")
    else:
        flash("Error updating tag: " + tag.get_last_error(), "error")
        return redirect(f"/tags/{id}/edit")

# Delete tag
@app.post("/tags/<int:id>/delete")
def delete_tag(id):
    tag = Tag.get_or_404(id)

    if tag.delete():
        flash(f"Tag '{tag.name}' deleted successfully", "success")
        return redirect(f"/tags")
    else:
        flash("Error deleting tag: " + tag.get_last_error(), "error")
        return redirect(f"/tags/{tag.id}")
