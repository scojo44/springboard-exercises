from flask import Flask, request
import operations

app = Flask(__name__)

@app.get("/add")
def sum():
  """Returns sum of a and b"""
  a,b = get_a_b()
  return f"{a} + {b} = {operations.add(a,b)}"

@app.get("/sub")
def diff():
  """Returns the difference between a and b"""
  a,b = get_a_b()
  return f"{a} - {b} = {operations.sub(a,b)}"

@app.get("/mult")
def proliferate():
  """Returns the product of a and b"""
  a,b = get_a_b()
  return f"{a} * {b} = {operations.mult(a,b)}"

@app.get("/div")
def partition():
  """Returns a divided by b"""
  a,b = get_a_b()
  return f"{a} / {b} = {operations.div(a,b)}"

def get_a_b():
  """Extracts a and b from the query string"""
  a = int(request.args.get("a", 0))
  b = int(request.args.get("b", 0))
  return (a,b)

# Further Study
@app.route("/math/<op>")
def calc(op):
  """Returns the result of an arithmetic operation on a and b
  - op: add, sub, mult or div"""
  ACTIONS = {
    "add": operations.add,
    "sub": operations.sub,
    "mult": operations.mult,
    "div": operations.div
  }
  a,b = get_a_b()
  op = op.lower()

  if not ACTIONS.get(op, None):
    return "Unsupported Operation: " + op
  if op == "div" and b == 0:
    result = "Nothing happens"
  else:
    result = ACTIONS[op](a,b)

  return f"{a} {op} {b} = {result}"