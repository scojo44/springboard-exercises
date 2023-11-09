from flask import Flask

app = Flask(__name__)

@app.route("/welcome")
def welcome():
  return "welcome"

@app.route("/welcome/<place>")
def welcome_here(place):
  return "welcome " + place