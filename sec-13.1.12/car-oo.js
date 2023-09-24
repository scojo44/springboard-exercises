class Vehicle{
  constructor(make, model, year){
    this.make = make;
    this.model = model;
    this.year = year;
  }
  honk(){
    return "Beep!";
  }
  toString(){
    return `You're driving the ${this.year} ${this.make} ${this.model}.`
  }
}

class Car extends Vehicle{
  constructor(make, model, year){
    super(make, model, year);
    this.numWheels = 4;
  }
}

class Motorcycle extends Vehicle{
  constructor(make, model, year){
    super(make, model, year);
    this.numWheels = 2;
  }
  revEngine(){
    return "VROOOOMMMMM!!!!";
  }
}

class Truck extends Vehicle {
  constructor(make, model, year, wheelCount) {
    super(make, model, year);
    this.numWheels = wheelCount;
    this.fuelType = "Diesel";
  }
  honk(){
    return "HHRRRRRMMMMMMMMMMMMMM!!!!";
  }
  slowDown(){
    return "PH-RB-RB-RB-RB-RB-RB!";
  }
}

class Garage{
  constructor(){
    this.vehicles = [];
    this.capacity = 2;
    this.spacesTaken = 0;
  }
  add(vehicle){
    if(!(vehicle instanceof Vehicle)){
      throw new Error("Sorry, this garage is for vehicles only.");
    }
    if(vehicle.numWheels > 4){
      throw new Error(`Sorry, your ${vehicle.make} ${vehicle.model} won't fit any of the spaces!`);
    }
    // Two motorcycles can fit side-by-side
    if(this.spacesTaken + vehicle.numWheels/4 > this.capacity){
      throw new Error("Sorry, there is no room available.");
    }
    this.vehicles.push(vehicle);
    this.spacesTaken += vehicle.numWheels/4;
    return `Added a ${vehicle.year} ${vehicle.make} ${vehicle.model}.`
  }
}

const v = new Vehicle("Chevy", "Suburban", 2015);
const c = new Car("Ford", "Escape", 2011);
const m = new Motorcycle("Kawasaki", "Ninja", 2020);
const t = new Truck("Kenworth", "T2000", 2010, 18);
const g = new Garage();