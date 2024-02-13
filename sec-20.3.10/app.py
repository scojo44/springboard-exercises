from flask import Flask, request, render_template, redirect, flash
from flask_debugtoolbar import DebugToolbarExtension
from surveys import surveys

app = Flask(__name__)
app.config["SECRET_KEY"] = "gEoCaChInG123"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension(app)
survey_taken = []
survey_answers = []

@app.get("/")
def show_landing():
  """Show the survey landing page."""
  return render_template("landing.html", surveys=surveys)

@app.post("/start")
def start_survey():
  """Initializes the survey responses session variable"""
  # Store the chosen survey in a list since assignment creates a local variable
  survey_taken.clear()
  survey_taken.append(request.form["survey"])
  return redirect("/question/0")

@app.get("/question/<int:id>")
def ask_question(id):
  """Ask a survey question."""
  survey = surveys[survey_taken[0]]
  questions_answered = len(survey_answers)
  editing = request.args.get("edit", False) == "True"

  # Processed the last question?  Go to the finish page.
  if questions_answered == len(survey.questions) and not editing:
    return redirect("/finish")
  # Avoid skipping questions by hand-editing the URL
  if id > questions_answered:
    flash("Invalid Question.  Here's the next one.", "error")
    return redirect(f"/question/{questions_answered + 1}")

  # Setup the next question
  question = survey.questions[id]
  return render_template("question.html", survey=survey, question_id=id, question=question, editing=editing)

@app.post("/answer")
def save_answer():
  """Save the user's answers."""

  question_id = int(request.form.get("q-id"))
  editing = request.form.get("edit", False) == "True"
  answer = {
    "answer": request.form.get("answer"),
    "comment": request.form.get("comment"),
    "skipped": request.form.get("answer") == "skip"
  }

  # Save the answer
  if editing:
    survey_answers[question_id] = answer
  else:
    survey_answers.append(answer)

  # Go to the next question
  return redirect(f"/question/{len(survey_answers)}")

@app.get("/finish")
def thank_user():
  """Thank the user for their time answering the survey."""
  return render_template("finish.html", survey=surveys[survey_taken[0]], answers=survey_answers)