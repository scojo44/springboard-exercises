from flask import request
from ...models import db, Cupcake
from . import bp

# List
@bp.get("")
def get_cupcakes():
    return {"cupcakes": [cake.serialize() for cake in Cupcake.get_all()]}

@bp.get("/search/<query>")
def search_cupcakes(query):
    select = db.select(Cupcake).where(Cupcake.flavor.ilike(f"%{query}%"))
    cupcakes = Cupcake.get_all(select)
    return {"query": query, "cupcakes": [cake.serialize() for cake in cupcakes]}

# Read
@bp.get("/<int:id>")
def get_cupcake(id):
    return {"cupcake": Cupcake.get_or_404(id).serialize()}

# Create
@bp.post("")
def add_new_cupcake():
    cake_data = {k:v for k,v in request.json.items()}
    new_cake = Cupcake(**cake_data)

    if new_cake.save():
        return {"cupcake": new_cake.serialize()}, 201
    else:
        return {"error": new_cake.get_last_error()}, 500
    
# Update
@bp.patch("/<int:id>")
def update_cupcake(id):
    cake = Cupcake.get_or_404(id)
    cake.flavor = request.json.get("flavor", cake.flavor)
    cake.size   = request.json.get("size",   cake.size)
    cake.rating = request.json.get("rating", cake.rating)
    cake.image  = request.json.get("image",  cake.image)

    if cake.save():
        return {"cupcake": cake.serialize()}
    else:
        return {"error": cake.get_last_error()}, 500

# Delete
@bp.delete("/<int:id>")
def delete_cupcake(id):
    cake = Cupcake.get_or_404(id)

    if cake.delete():
        return {"cupcake": cake.serialize(), "deleted": True}
    else:
        return {"error": cake.get_last_error()}, 500