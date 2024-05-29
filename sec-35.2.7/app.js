/** BizTime express application. */
const express = require("express");
const morgan = require('morgan');

const app = express();
const ExpressError = require("./expressError")
const industryRoutes = require('./routes/industries');
const companyRoutes = require('./routes/companies');
const invoiceRoutes = require('./routes/invoices');

app.use(express.json());
app.use(morgan('dev'));
app.use('/industries', industryRoutes);
app.use('/companies', companyRoutes);
app.use('/invoices', invoiceRoutes);

/** 404 handler */

app.use((req, res, next) => {
  return next(new ExpressError("Not Found", 404));
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
