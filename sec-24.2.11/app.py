"""Blogly application."""
import os, tomllib
from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Post

app = Flask(__name__)
config_file = os.environ.get('APP_TEST_CONFIG', 'config.toml')
app.config.from_file(config_file, load=tomllib.load, text=False)
debug = DebugToolbarExtension(app)

connect_db(app)

#######################################
# Home routes

@app.get("/")
def show_recent_posts():
    recent = db.session.scalars(db.select(Post).order_by(Post.created_at.desc()).limit(5))
    return render_template("index.html.jinja", posts=recent)

@app.errorhandler(404)
def show_not_found(e):
    return render_template("errors/404.html.jinja"), 404

#######################################
# User routes

# Show user
@app.get("/users")
def list_users():
    users = db.session.scalars(db.select(User).order_by(User.last_name, User.first_name))
    return render_template("user_list.html.jinja", users=users)

@app.get("/users/<int:id>")
def show_user_info(id):
    user = db.get_or_404(User, id, description="User doesn't exist")
    return render_template("user_show.html.jinja", user=user)

# Create user
@app.get("/users/new")
def show_new_user_form():
    return render_template("user_new.html.jinja")

@app.post("/users/new")
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
@app.get("/users/<int:id>/edit")
def show_edit_user_form(id):
    user = db.get_or_404(User, id, description="User doesn't exist")
    return render_template("user_edit.html.jinja", user=user)

@app.post("/users/<int:id>/edit")
def update_user(id):
    user = db.get_or_404(User, id, description="User doesn't exist")
    (user.first_name, user.last_name, user.image_url) = get_user_form_data(request.form)

    if(user.save()):
        flash(f"User {user.full_name} updated successfully", "success")
        return redirect(f"/users/{user.id}")
    else:
        flash("Error updating user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}/edit")

# Delete user
@app.post("/users/<int:id>/delete")
def delete_user(id):
    user = db.get_or_404(User, id, description="User doesn't exist")

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

#######################################
# Post routes

# Show post
@app.get("/posts/<int:id>")
def show_post(id):
    post = db.get_or_404(Post, id, description="Post doesn't exist")
    return render_template("post_show.html.jinja", post=post)

# Create post
@app.get("/users/<int:user_id>/posts/new")
def show_new_post_form(user_id):
    user = db.get_or_404(User, user_id, description="User doesn't exist")
    return render_template("post_new.html.jinja", user=user)

@app.post("/users/<int:user_id>/posts/new")
def save_new_post(user_id):
    (title, content) = get_post_form_data(request.form)
    new_post = Post(title=title, content=content, user_id=user_id)

    if(new_post.save()):
        flash(f"Post '{new_post.title}' added successfully", "success")
        return redirect(f"/posts/{new_post.id}")
    else:
        flash("Error adding post: " + new_post.get_last_error(), "error")
        return redirect(f"/users/{user_id}/posts/new")

# Edit post
@app.get("/posts/<int:id>/edit")
def show_edit_post_form(id):
    post = db.get_or_404(Post, id, description="Post doesn't exist")
    return render_template("post_edit.html.jinja", post=post)

@app.post("/posts/<int:id>/edit")
def update_post(id):
    post = db.get_or_404(Post, id, description="Post doesn't exist")
    (post.title, post.content) = get_post_form_data(request.form)

    if(post.save()):
        flash(f"Post '{post.title}' updated successfully", "success")
        return redirect(f"/posts/{post.id}")
    else:
        flash("Error updating post: " + post.get_last_error(), "error")
        return redirect(f"/posts/{post.id}/edit")

# Delete post
@app.post("/posts/<int:id>/delete")
def delete_post(id):
    post = db.get_or_404(Post, id, description="Post doesn't exist")

    if(post.delete()):
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
