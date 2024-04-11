from flask import request, redirect, render_template, flash
from ...models import db, Post, Tag
from . import bp

# Show tag
@bp.get("/tags/<int:id>")
def show_tag(id):
    return render_template("tag/show.html.jinja", tag=Tag.get_or_404(id))

@bp.get("/tags")
def list_tags():
    return render_template("tag/list.html.jinja", tags=Tag.get_all())

# Create tag
@bp.get("/tags/new")
def show_new_tag_form():
    return render_template("tag/new.html.jinja", posts=Post.get_all())

@bp.post("/tags/new")
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
@bp.get("/tags/<int:id>/edit")
def show_edit_tag_form(id):
    return render_template("tag/edit.html.jinja", tag=Tag.get_or_404(id), posts=Post.get_all())

@bp.post("/tags/<int:id>/edit")
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
@bp.post("/tags/<int:id>/delete")
def delete_tag(id):
    tag = Tag.get_or_404(id)

    if tag.delete():
        flash(f"Tag '{tag.name}' deleted successfully", "success")
        return redirect(f"/tags")
    else:
        flash("Error deleting tag: " + tag.get_last_error(), "error")
        return redirect(f"/tags/{tag.id}")
