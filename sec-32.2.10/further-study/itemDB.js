const fs = require('fs');
const ExpressError = require('../expressError');

class Item {
  constructor(name, price) {
    if (!name || !price)
      throw new ExpressError("Item(): Name and price are required", 400);

    this.name = name;
    this.price = price;
  }
}

class ItemDB {
  constructor(filename) {
    this.filename = filename;
    this.items = this.load() || [];
  }

  add(item){
    this.items.push(item);
    return this.save()? item : false;
  }

  update(name, newName, newPrice){
    const item = this.getByName(name);
    item.name = newName;
    item.price = newPrice;
    return this.save()? item : false;
  }

  remove(name){
    const idx = this.items.findIndex(item => item.name === name);
    this.items.splice(idx, 1);
    return this.save();
  }

  clear() {
    while(this.items.length)
      this.items.pop();
    return this.save();
  }

  getByName(name) {
    const item = this.items.find(i => i.name === name);
    if (!item) throw new ExpressError('Item not found: ' + name, 404);
    return item;
  }

  load() {
    try {
      const data = fs.readFileSync(this.filename, 'utf8');
      return data? JSON.parse(data) : false;
    }
    catch(err) {
      console.error(err);
      return false;  // File likely doesn't exist.
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filename, JSON.stringify(this.items));
      return true;
    }
    catch(err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = {ItemDB, Item};
