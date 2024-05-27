const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');

const router = new express.Router();

router.get('', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM companies');
    return res.json({companies: result.rows});
  }
  catch(e) {
    return next(e);
  }
});

router.get('/:code', async (req, res, next) => {
  try {
    const {code} = req.params;
    const result = await db.query('SELECT * FROM companies WHERE code = $1', [code]);

    if(result.rows.length === 0)
      throw new ExpressError(`Company with code, ${code}, doesn't exist`, 404)

    return res.json({company: result.rows[0]});
  }
  catch(e) {
    return next(e);
  }
});

router.post('', async (req, res, next) => {
  try {
    const {code, name, desc} = req.body;
    const result = await db.query(
     `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING *`, [code, name, desc]
    );

    return res.json({company: result.rows[0]});
  }
  catch(e) {
    return next(e);
  }
});

router.put('/:code', async (req, res, next) => {
  try {
    const {code} = req.params;
    const {name, desc} = req.body;
    const result = await db.query(
     `UPDATE companies SET name=$2, description=$3
      WHERE code = $1
      RETURNING *`, [code, name, desc]
    );

    if(result.rows.length === 0)
      throw new ExpressError(`Company with code, ${code}, doesn't exist`, 404)

    return res.json({company: result.rows[0]});
  }
  catch(e) {
    return next(e);
  }
});

router.delete('/:code', async (req, res, next) => {
  try {
    const {code} = req.params;
    const result = await db.query('DELETE FROM companies WHERE code = $1', [code]);

    if(result.rows.length === 0)
      throw new ExpressError(`Company with code, ${code}, doesn't exist`, 404)

    return res.json({status: 'Deleted company ' + code});
  }
  catch(e) {
    return next(e);
  }
});

module.exports = router;