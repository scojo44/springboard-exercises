from flask import request, redirect, render_template, flash
from ...models import db, User, Post, Tag
from . import bp

# Show post
@bp.get("/posts/<int:id>")
def show_post(id):
    return render_template("post/show.html.jinja", post=Post.get_or_404(id))

# Create post
@bp.get("/users/<int:user_id>/posts/new")
def show_new_post_form(user_id):
    return render_template("post/new.html.jinja", user=User.get_or_404(id), tags=Tag.get_all())

@bp.post("/users/<int:user_id>/posts/new")
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
@bp.get("/posts/<int:id>/edit")
def show_edit_post_form(id):
    return render_template("post/edit.html.jinja", post=Post.get_or_404(id), tags=Tag.get_all())

@bp.post("/posts/<int:id>/edit")
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
@bp.post("/posts/<int:id>/delete")
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
