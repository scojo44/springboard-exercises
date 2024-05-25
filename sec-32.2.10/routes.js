const express = require('express');
const ExpressError = require('./expressError');
const items = require('./fakeDB');

const router = new express.Router();

router.get('', (req, res) => {
  return res.json(items);
});

router.get('/:name', (req, res, next) => {
  try {
    const item = getItem(req.params.name);
    return res.json(item);
  }
  catch(error) {
    return next(error);
  }
});

router.post('', (req, res) => {
  if (!req.body.name || !req.body.price)
    throw new ExpressError("Name and price are required", 400);

  const newItem = {
    name: req.body.name,
    price: req.body.price
  }
  items.push(newItem);

  return res.status(201).json({added: newItem});
});

router.patch('/:name', (req, res, next) => {
  try {
    const item = getItem(req.params.name);
    item.name = req.body.name;
    item.price = req.body.price;
    return res.json({updated: item});
  }
  catch(error) {
    return next(error);
  }
});

router.delete('/:name', (req, res, next) => {
  try {
    const idx = items.findIndex(item => item.name === req.params.name);
    const item = getItem(req.params.name);
    items.splice(idx, 1);
    return res.json({message: 'Deleted ' + item.name})
  }
  catch(error) {
    return next(error);
  }
});

function getItem(name) {
  const item = items.find(i => i.name === name);  
  if (!item) throw new ExpressError('Item not found: ' + name, 404);
  return item;
}

module.exports = router;
