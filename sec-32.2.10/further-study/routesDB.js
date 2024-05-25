const express = require('express');
const ExpressError = require('../expressError');
const {ItemDB, Item} = require('./itemDB'); // Further Study class saving items to a file.

const router = new express.Router();
let db;

if(process.env.NODE_ENV === 'test')
  db = new ItemDB('items.test.json');
else
  db = new ItemDB('items.json');

router.get('', (req, res) => {
  return res.json(db.items);
});

router.get('/:name', (req, res, next) => {
  try {
    const item = db.getByName(req.params.name);
    return res.json(item);
  }
  catch(error) {
    return next(error);
  }
});

router.post('', (req, res) => {
  const newItem = db.add(new Item(req.body.name, req.body.price));

  if(newItem)
    return res.status(201).json({added: newItem});
  else
    throw new ExpressError(`Error adding ${req.body.name}, $${req.body.price}`, 400);
});

router.patch('/:name', (req, res, next) => {
  try {
    const item = db.update(req.params.name, req.body.name, req.body.price);

    if(item)
      return res.json({updated: item});
    else
      throw new ExpressError("Error updating " + req.params.name, 400);
  }
  catch(error) {
    return next(error);
  }
});

router.delete('/:name', (req, res, next) => {
  try {
    const item = db.getByName(req.params.name);

    if(db.remove(req.params.name))
      return res.json({message: item.name + ' deleted'});
    else
      throw new ExpressError("Error deleting " + item.name, 400);
  }
  catch(error) {
    return next(error);
  }
});

module.exports = [router, db];
