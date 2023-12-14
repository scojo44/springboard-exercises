"""Blogly application."""
from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, User, Post, Tag

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "FlaskDebugTB-Key"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

connect_db(app)

#######################################
# Home routes

@app.route("/")
def show_recent_posts():
    recent = Post.query.order_by(Post.created_at.desc()).limit(5)
    return render_template("index.html.jinja", posts=recent)

@app.errorhandler(404)
def show_not_found(e):
    return render_template("errors/404.html.jinja"), 404

#######################################
# User routes

# Show user
@app.route("/users")
def list_users():
    users = User.query.order_by(User.last_name, User.first_name).all()
    return render_template("user_list.html.jinja", users=users)

@app.route("/users/<int:id>")
def show_user(id):
    return render_template("user_show.html.jinja", user=User.query.get_or_404(id))

# Create user
@app.route("/users/new")
def show_new_user_form():
    return render_template("user_new.html.jinja")

@app.route("/users/new", methods=["POST"])
def save_new_user():
    first, last, image = get_user_form_data(request.form)
    new_user = User(first_name=first, last_name=last, image_url=image)
    existing_user = User.query.filter_by(first_name=first, last_name=last).one_or_none()

    if existing_user:
        flash(f"User {new_user} already exists.  Here it is.", "error")
        return redirect(f"/tags/{existing_user.id}")

    if new_user.save():
        flash(f"User {new_user.full_name} added successfully", "success")
        return redirect(f"/users/{new_user.id}")
    else:
        flash("Error adding user: " + new_user.get_last_error(), "error")
        return redirect("/users/new")

# Edit user
@app.route("/users/<int:id>/edit")
def show_edit_user_form(id):
    return render_template("user_edit.html.jinja", user=User.query.get_or_404(id))

@app.route("/users/<int:id>/edit", methods=["POST"])
def update_user(id):
    user = User.query.get_or_404(id)
    user.first_name, user.last_name, user.image_url = get_user_form_data(request.form)

    if user.save():
        flash(f"User {user.full_name} updated successfully", "success")
        return redirect(f"/users/{user.id}")
    else:
        flash("Error updating user: " + user.get_last_error(), "error")
        return redirect(f"/users/{user.id}/edit")

# Delete user
@app.route("/users/<int:id>/delete", methods=["POST"])
def delete_user(id):
    user = User.query.get_or_404(id)

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
@app.route("/posts/<int:id>")
def show_post(id):
    return render_template("post_show.html.jinja", post=Post.query.get_or_404(id))

# Create post
@app.route("/users/<int:user_id>/posts/new")
def show_new_post_form(user_id):
    return render_template("post_new.html.jinja", user=User.query.get_or_404(user_id), tags=Tag.query.all())

@app.route("/users/<int:user_id>/posts/new", methods=["POST"])
def save_new_post(user_id):
    title, content = get_post_form_data(request.form)
    new_post = Post(title=title, content=content, user_id=user_id)
    new_post.tags = Tag.query.filter(Tag.id.in_(request.form.getlist("tags"))).all()

    if new_post.save():
        flash(f"Post '{new_post.title}' added successfully", "success")
        return redirect(f"/posts/{new_post.id}")
    else:
        flash("Error adding post: " + new_post.get_last_error(), "error")
        return redirect(f"/users/{user_id}/posts/new")

# Edit post
@app.route("/posts/<int:id>/edit")
def show_edit_post_form(id):
    return render_template("post_edit.html.jinja", post=Post.query.get_or_404(id), tags=Tag.query.all())

@app.route("/posts/<int:id>/edit", methods=["POST"])
def update_post(id):
    post = Post.query.get_or_404(id)
    post.title, post.content = get_post_form_data(request.form)
    post.tags = Tag.query.filter(Tag.id.in_(request.form.getlist("tags"))).all()

    if post.save():
        flash(f"Post '{post.title}' updated successfully", "success")
        return redirect(f"/posts/{post.id}")
    else:
        flash("Error updating post: " + post.get_last_error(), "error")
        return redirect(f"/posts/{post.id}/edit")

# Delete post
@app.route("/posts/<int:id>/delete", methods=["POST"])
def delete_post(id):
    post = Post.query.get_or_404(id)

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
@app.route("/tags/<int:id>")
def show_tag(id):
    return render_template("tag_show.html.jinja", tag=Tag.query.get_or_404(id))

@app.route("/tags")
def list_tags():
    return render_template("tag_list.html.jinja", tags=Tag.query.all())

# Create tag
@app.route("/tags/new")
def show_new_tag_form():
    return render_template("tag_new.html.jinja", posts=Post.query.all())

@app.route("/tags/new", methods=["POST"])
def save_new_tag():
    new_tag = Tag(name=request.form.get("name"))
    existing_tag = Tag.query.filter_by(name=new_tag.name).one_or_none()

    if existing_tag:
        flash(f"Tag '{new_tag}' already exists.  Here it is.", "error")
        return redirect(f"/tags/{existing_tag.id}")

    new_tag.posts = Post.query.filter(Post.id.in_(request.form.getlist("posts"))).all()

    if new_tag.save():
        flash(f"Tag '{new_tag.name}' added successfully", "success")
        return redirect(f"/tags/{new_tag.id}")
    else:
        flash(f"Error adding tag: {new_tag.get_last_error()}", "error")
        return redirect("/tags/new")

# Edit tag
@app.route("/tags/<int:id>/edit")
def show_edit_tag_form(id):
    return render_template("tag_edit.html.jinja", tag=Tag.query.get_or_404(id), posts=Post.query.all())

@app.route("/tags/<int:id>/edit", methods=["POST"])
def update_tag(id):
    tag = Tag.query.get_or_404(id)
    tag.name = request.form.get("name")
    tag.posts = Post.query.filter(Post.id.in_(request.form.getlist("posts"))).all()

    if tag.save():
        flash(f"Tag '{tag.name}' updated successfully", "success")
        return redirect(f"/tags/{id}")
    else:
        flash("Error updating tag: " + tag.get_last_error(), "error")
        return redirect(f"/tags/{id}/edit")

# Delete tag
@app.route("/tags/<int:id>/delete", methods=["POST"])
def delete_tag(id):
    tag = Tag.query.get_or_404(id)

    if tag.delete():
        flash(f"Tag '{tag.name}' deleted successfully", "success")
        return redirect(f"/tags")
    else:
        flash("Error deleting tag: " + tag.get_last_error(), "error")
        return redirect(f"/tags/{tag.id}")
