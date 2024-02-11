from flask import Flask

app = Flask(__name__)

@app.get("/welcome")
def welcome():
  return "welcome"

@app.get("/welcome/<place>")
def welcome_here(place):
  return "welcome " + place