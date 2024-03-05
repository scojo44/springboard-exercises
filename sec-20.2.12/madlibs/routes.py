from flask import Blueprint, request, render_template
from .stories import stories

home_bp = Blueprint("home_bp", __name__)

@home_bp.get("/")
def index():
  return render_template("index.html", stories=stories)

@home_bp.get("/prompt/<id>")
def prompt(id):
  """Ask the user for words"""
  story = get_story_by_id(id)
  return render_template("prompts.html", story=story)

@home_bp.post("/story")
def generate_story():
  """Show the story with the user's answers"""
  id = request.form.get("id", 1)
  story = get_story_by_id(id)
  text = story.generate(request.form)
  return render_template("story.html", story=story, text=text)

def get_story_by_id(id):
  return stories[int(id) - 1]