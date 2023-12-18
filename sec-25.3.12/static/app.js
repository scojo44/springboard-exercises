const cupcakes = document.querySelector("#cupcakes");
const messages = document.getElementById("messages");

class Message {
  /** Show a message to the player */
  static show(message, severity="") {
    this.clear();
    messages.innerHTML = message;
    if(severity)
      messages.classList.add(severity);
  }

  /** Clear the messages */
  static clear() {
    messages.innerHTML = "";
    messages.setAttribute("class", "");
  }
}

class Cupcakes {
  constructor(){
    this.getCupcakes();
    cupcakes.addEventListener("click", async (e) => await this.cupcakeClicked(e));
    document.getElementById("search-button").addEventListener("click", (e) => this.searchCupcakes(e));
    document.getElementById("query").addEventListener("keyup", (e) => this.searchCupcakes(e))
    document.getElementById("add-form").addEventListener("submit", async (e) => await this.createCupcake(e));
    document.getElementById("edit-form").addEventListener("submit", async (e) => await this.updateCupcake(e));
  }
  
  async searchCupcakes(e){
    e.preventDefault();
    await this.getCupcakes(document.getElementById("query").value);
  }
  
  async getCupcakes(query){
    let search = "";
    Message.clear();
 
    if(query)
      search = "/search/" + query;
  
    try{
      const response = await axios.get("/api/cupcakes" + search);
      cupcakes.innerHTML = ""; // Clear list for searches
      for(let cake of response.data.cupcakes)
        this.addToLocalList(cake);
    }
    catch(error){
      Message.show("Error getting cupcakes from the server: " + error, "error");
      console.error(error);
    }
  }
  
  addToLocalList(cake){
    const liner = document.createElement("div");
    
    liner.innerHTML = `<h2 class="mt-4">${cake.flavor}</h2>
    <img src="${cake.image}" alt="Cupcake Photo">
    <p>
      #${cake.id}
      <br>Size: ${cake.size}
      <br>Rating: ${cake.rating}
    </p>
    <p data-id="${cake.id}" data-flavor="${cake.flavor}" data-size="${cake.size}" data-rating="${cake.rating}" data-image="${cake.image}">
      <button type="button" class="btn btn-sm btn-outline-success">Edit</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button type="button" class="btn btn-sm btn-outline-danger">Delete</button>
    </p>`;
    
    liner.classList.add("col");
    liner.classList.add("cupcake");
    cupcakes.append(liner);
  }
  
  async createCupcake(e) {
    e.preventDefault();
  
    const cake = this.getCupcakeFields("add");
  
    try{
      const response = await axios.post("/api/cupcakes", cake);
      const newCake = response.data.cupcake;
      console.log(this);
  
      if(newCake.id > 0){
        Message.show(`Cupcake flavor ${cake.flavor} created successfully as #${newCake.id}`, "success");
        this.addToLocalList(newCake);
      }
    }
    catch(error){
      Message.show("Error creating cupcake: " + error, "error");
      console.error(error);
    }
  }

  getCupcakeFields(form){
    return {
      flavor: document.querySelector(`#${form}-form #flavor`).value,
      size:   document.querySelector(`#${form}-form #size`).value,
      rating: document.querySelector(`#${form}-form #rating`).value,
      image:  document.querySelector(`#${form}-form #image`).value
    };
  }

  fillEditCupcakeForm(cake){
    location.href = "#edit-form";
    document.querySelector("#edit-form #cake-id").value = cake.id;
    document.querySelector("#edit-form #flavor").value = cake.flavor;
    document.querySelector("#edit-form #size").value = cake.size;
    document.querySelector("#edit-form #rating").value = cake.rating;
    document.querySelector("#edit-form #image").value = cake.image;
  }

  async updateCupcake(e){
    e.preventDefault();

    const cake = this.getCupcakeFields("edit");
    cake.id = document.querySelector("#edit-form #cake-id").value;

    try{
      const response = await axios.patch("/api/cupcakes/" + cake.id, cake);
      const newCake = response.data.cupcake;
      Message.show(`Cupcake flavor ${newCake.flavor} updated successfully`, "success");
      // Find the original cupcake and replace it with the updated one
      document.querySelector(`.cupcake p[data-id="${cake.id}"]`).parentElement.remove();
      this.addToLocalList(newCake);
    }
    catch(error){
      Message.show("Error updating cupcake: " + error, "error");
      console.error(error);
    }
  }

  async deleteCupcake(cakeID){
    try{
      const response = await axios.delete("/api/cupcakes/" + cakeID);
  
      if(response.data.deleted){
        const cake = response.data.cupcake;
        Message.show(`Cupcake flavor ${cake.flavor} deleted successfully`, "success");
        e.target.parentElement.parentElement.remove();
      }
    }
    catch(error){
      Message.show("Error deleting cupcake: " + error, "error");
      console.error(error);
    }
  }
  
  async cupcakeClicked(e){
    if(e.target.tagName.toLowerCase() != "button")
      return;

    // Convert cake dataset into a cake object
    const cake = {...e.target.parentElement.dataset};

    switch(e.target.textContent){
      case "Edit":  this.fillEditCupcakeForm(cake);  break;
      case "Delete":  await this.deleteCupcake(cake.id); break;
      default:  console.log("No button clicked in cupcakeClicked().");
    }
  }
}


document.addEventListener("DOMContentLoaded", () => cakeList = new Cupcakes());