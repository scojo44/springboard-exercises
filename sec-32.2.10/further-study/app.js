const express = require('express');
const morgan = require('morgan');
const ExpressError = require('../expressError');
const [itemRoutes, db] = require('./routesDB');

const app = express();

app.use(morgan('dev'));
app.use(express.json())
app.use('/items', itemRoutes);

// 404 handler
app.use((req, res, next) => {
  return new ExpressError("Not Found", 404);
});

// General error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({error: err.message});
});

module.exports = {app, db};
