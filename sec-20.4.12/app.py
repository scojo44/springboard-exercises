from flask import Flask, request, render_template, redirect, flash, session, make_response
from flask_debugtoolbar import DebugToolbarExtension
from surveys import surveys

app = Flask(__name__)
app.config["SECRET_KEY"] = "gEoCaChInG123"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
debug = DebugToolbarExtension(app)
SURVEY_SESSION_KEY = "survey being taken"
ANSWERS_SESSION_KEY = "survey answers"

@app.get("/")
def show_landing():
  """Show the survey landing page."""
  surveys_completed = {}
  for key,survey in surveys.items():
    surveys_completed[key] = request.cookies.get(key) == "done"
  return render_template("landing.html.jinja", surveys=surveys, completed=surveys_completed)

@app.post("/start")
def start_survey():
  """Initializes the survey responses session variable"""
  session[SURVEY_SESSION_KEY] = request.form["survey"]
  session[ANSWERS_SESSION_KEY] = []
  return redirect("/question/0")

@app.get("/question/<int:id>")
def ask_question(id):
  """Ask a survey question."""
  survey = surveys[session[SURVEY_SESSION_KEY]]
  questions_answered = len(session[ANSWERS_SESSION_KEY])
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
  return render_template("question.html.jinja", survey=survey, question_id=id, question=question, editing=editing)

@app.post("/answer")
def save_answer():
  """Save the user's answers."""

  question_id = int(request.form.get("q-id"))
  editing = request.form.get("edit", False) == "True"
  answers = session[ANSWERS_SESSION_KEY]
  answer = {
    "answer": request.form.get("answer"),
    "comment": request.form.get("comment"),
    "skipped": request.form.get("answer") == "skip"
  }

  # Save the answer
  if editing:
    answers[question_id] = answer
  else:
    answers.append(answer)

  session[ANSWERS_SESSION_KEY] = answers

  # Go to the next question
  return redirect(f"/question/{len(answers)}")

@app.get("/finish")
def thank_user():
  """Thank the user for their time answering the survey."""
  survey = surveys[session[SURVEY_SESSION_KEY]]
  answers = session[ANSWERS_SESSION_KEY]
  html = render_template("finish.html.jinja", survey=survey, answers=answers)
  response = make_response(html)
  response.set_cookie(session[SURVEY_SESSION_KEY], "done")
  return response