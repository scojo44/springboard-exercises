from flask import Flask, request, render_template
from flask_debugtoolbar import DebugToolbarExtension
from stories import stories

app = Flask(__name__)
app.config["SECRET_KEY"] = "ABC123-xyz-789"
debug = DebugToolbarExtension(app)

@app.get("/")
def index():
  return render_template("index.html", stories=stories)

@app.get("/prompt/<id>")
def prompt(id):
  """Ask the user for words"""
  story = get_story_by_id(id)
  return render_template("prompts.html", story=story)

@app.post("/story")
def generate_story():
  """Show the story with the user's answers"""
  id = request.form.get("id", 1)
  story = get_story_by_id(id)
  text = story.generate(request.form)
  return render_template("story.html", story=story, text=text)

def get_story_by_id(id):
  return stories[int(id) - 1]