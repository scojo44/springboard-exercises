const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');

const router = new express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM invoices');
    return res.json({invoices: result.rows});
  }
  catch(e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    let result = await db.query(
     `SELECT * FROM invoices
      WHERE id = $1`, [id]
    );

    if(result.rows.length === 0)
      throw new ExpressError(`Invoice #${id} doesn't exist`, 404);

    // Get the company for this invoice
    const invoice = result.rows[0];

    result = await db.query(
     `SELECT * FROM companies
      WHERE code = $1`, [invoice.comp_code]
    );
    
    invoice.company = result.rows[0];

    return res.json({invoice});
  }
  catch(e) {
    return next(e);
  }
});

router.post('', async (req, res, next) => {
  try {
    const {comp_code, amt} = req.body;

    if(!comp_code || !amt)
      throw new ExpressError(`Company code and amount are required`, 400);

    const result = await db.query(
     `INSERT INTO invoices (comp_code, amt)
      VALUES ($1, $2)
      RETURNING *`, [comp_code, amt]
    );

    return res.status(201).json({invoice: result.rows[0]});
  }
  catch(e) {
    return next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    let {amt = null, paid = null} = req.body;

    let result = await db.query(
      `SELECT * FROM invoices
       WHERE id = $1`, [id]
     );

    if(result.rows.length === 0)
      throw new ExpressError(`Invoice #${id} doesn't exist`, 404);

    let invoice = result.rows[0];

    // Get current amount if not provided
    if(amt === null)
      amt = invoice.amt;

    if(paid === null)
      paid = invoice.paid; // Get current paid status if not provided
    else {
      // Invoice was just paid
      if(paid && !invoice.paid_date)
        invoice.paid_date = new Date();

      // Clear paid date if the invoice was just now unpaid
      if(!paid)
        invoice.paid_date = null;

      // Otherwise, invoice was already paid so don't change the paid_date
    }

    result = await db.query(
     `UPDATE invoices SET amt=$2, paid=$3, paid_date=$4
      WHERE id = $1
      RETURNING *`, [id, amt, paid, invoice.paid_date]
    );

    return res.json({invoice: result.rows[0]});
  }
  catch(e) {
    return next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await db.query(
     `DELETE FROM invoices
      WHERE id = $1
      RETURNING id`, [id]
    );

    if(result.rows.length === 0)
      throw new ExpressError(`Invoice #${id} doesn't exist`, 404);

    return res.json({status: 'Deleted invoice #' + id});
  }
  catch(e) {
    return next(e);
  }
});


module.exports = router;
