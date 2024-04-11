from flask import request, redirect, render_template, flash
from ...models.user import User
from ...models.post import Post
from . import bp

# Show post
@bp.get("/posts/<int:id>")
def show_post(id):
    post = Post.get_or_404(id)
    return render_template("post_show.html.jinja", post=post)

# Create post
@bp.get("/users/<int:user_id>/posts/new")
def show_new_post_form(user_id):
    user = User.get_or_404(user_id)
    return render_template("post_new.html.jinja", user=user)

@bp.post("/users/<int:user_id>/posts/new")
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
@bp.get("/posts/<int:id>/edit")
def show_edit_post_form(id):
    post = Post.get_or_404(id)
    return render_template("post_edit.html.jinja", post=post)

@bp.post("/posts/<int:id>/edit")
def update_post(id):
    post = Post.get_or_404(id)
    (post.title, post.content) = get_post_form_data(request.form)

    if(post.save()):
        flash(f"Post '{post.title}' updated successfully", "success")
        return redirect(f"/posts/{post.id}")
    else:
        flash("Error updating post: " + post.get_last_error(), "error")
        return redirect(f"/posts/{post.id}/edit")

# Delete post
@bp.post("/posts/<int:id>/delete")
def delete_post(id):
    post = Post.get_or_404(id)

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