/** Routes for Lunchly */
const express = require("express");
const Customer = require("./models/customer");
const Reservation = require("./models/reservation");

const router = new express.Router();

/** Homepage: show list of customers. */

router.get("/", async function(req, res, next) {
  try {
    const {search} = req.query;
    const customers = await Customer.all(search);

    return res.render("customer_list.html.jinja", { customers });
  } catch (err) {
    return next(err);
  }
});

/** Show the top 10 best customers. */

router.get("/top/:count", async function(req, res, next) {
  try {
    const {count} = req.params;
    const customers = await Customer.top(count);
    return res.render("customer_top.html.jinja", { customers, count });
  } catch (err) {
    return next(err);
  }
});

/** Form to add a new customer. */

router.get("/add/", async function(req, res, next) {
  try {
    return res.render("customer_new_form.html.jinja");
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new customer. */

router.post("/add/", async function(req, res, next) {
  try {
    const {firstName, middleName, lastName, phone, notes} = req.body;
    const customer = new Customer({ firstName, middleName, lastName, phone, notes });
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Show a customer, given their ID. */

router.get("/:id/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    const reservations = await customer.getReservations();

    return res.render("customer_detail.html.jinja", { customer, reservations });
  } catch (err) {
    return next(err);
  }
});

/** Show form to edit a customer. */

router.get("/:id/edit/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);

    res.render("customer_edit_form.html.jinja", { customer });
  } catch (err) {
    return next(err);
  }
});

/** Handle editing a customer. */

router.post("/:id/edit/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    customer.firstName = req.body.firstName;
    customer.middleName = req.body.middleName;
    customer.lastName = req.body.lastName;
    customer.phone = req.body.phone;
    customer.notes = req.body.notes;
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new reservation. */

router.post("/:id/add-reservation/", async function(req, res, next) {
  try {
    const customerID = req.params.id;
    const startAt = new Date(req.body.startAt);
    const numGuests = req.body.numGuests;
    const notes = req.body.notes;

    const reservation = new Reservation({
      customerID,
      startAt,
      numGuests,
      notes
    });
    await reservation.save();

    return res.redirect(`/${customerID}/`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
