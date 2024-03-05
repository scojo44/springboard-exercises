"""Routes for the calc exercise."""
from flask import Blueprint, request
from .operations import add, sub, mult, div

calc_bp = Blueprint("calc", __name__)

@calc_bp.get("/add")
def sum():
  """Returns sum of a and b"""
  a,b = get_a_b()
  return f"{a} + {b} = {add(a,b)}"

@calc_bp.get("/sub")
def diff():
  """Returns the difference between a and b"""
  a,b = get_a_b()
  return f"{a} - {b} = {sub(a,b)}"

@calc_bp.get("/mult")
def proliferate():
  """Returns the product of a and b"""
  a,b = get_a_b()
  return f"{a} * {b} = {mult(a,b)}"

@calc_bp.get("/div")
def partition():
  """Returns a divided by b"""
  a,b = get_a_b()
  return f"{a} / {b} = {div(a,b)}"

def get_a_b():
  """Extracts a and b from the query string"""
  a = int(request.args.get("a", 0))
  b = int(request.args.get("b", 0))
  return (a,b)

# Further Study
@calc_bp.route("/math/<op>")
def calc(op):
  """Returns the result of an arithmetic operation on a and b
  - op: add, sub, mult or div"""
  ACTIONS = {
    "add": add,
    "sub": sub,
    "mult": mult,
    "div": div
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