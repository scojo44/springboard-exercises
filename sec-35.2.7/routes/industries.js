const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
const db = require('../db');

const router = new express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM industries');
    return res.json({industries: result.rows});
  }
  catch(e) {
    return next(e);
  }
});

router.get('/:code', async (req, res, next) => {
  try {
    const {code} = req.params;
    let result = await db.query(
     `SELECT * FROM industries
      WHERE code = $1`, [code]
    );

    if(result.rows.length === 0)
      throw new ExpressError(`Industry with code, ${code}, doesn't exist`, 404);

    // Get the companies for this industry
    const industry = result.rows[0];

    result = await db.query(
     `SELECT c.code FROM companies c
      JOIN sectors s ON c.code = s.comp_code
      JOIN industries i ON s.ind_code = i.code
      WHERE ind_code = $1`, [industry.code]
    );
    
    industry.companies = result.rows.map(c => c.code);

    return res.json({industry});
  }
  catch(e) {
    return next(e);
  }
});

router.post('', async (req, res, next) => {
  try {
    const {name} = req.body;

    if(!name)
      throw new ExpressError(`Industry name is required`, 400);

    const code = slugify(name, {lower: true});

    const result = await db.query(
     `INSERT INTO industries (code, name)
      VALUES ($1, $2)
      RETURNING *`, [code, name]
    );

    return res.status(201).json({industry: result.rows[0]});
  }
  catch(e) {
    return next(e);
  }
});

router.put('/:code', async (req, res, next) => {
  try {
    const {code} = req.params;
    const {name} = req.body;

    if(!name)
      throw new ExpressError(`Name is required`, 400);

    const result = await db.query(
     `UPDATE industries SET name=$2
      WHERE code = $1
      RETURNING *`, [code, name]
    );

    if(result.rows.length === 0)
      throw new ExpressError(`Industry with code, ${code}, doesn't exist`, 404);

    return res.json({industry: result.rows[0]});
  }
  catch(e) {
    return next(e);
  }
});

router.delete('/:code', async (req, res, next) => {
  try {
    const {code} = req.params;
    const result = await db.query(
     `DELETE FROM industries
      WHERE code = $1
      REtURNING code`, [code]
    );

    if(result.rows.length === 0)
      throw new ExpressError(`Industry with code, ${code}, doesn't exist`, 404);

    return res.json({status: 'Deleted industry ' + code});
  }
  catch(e) {
    return next(e);
  }
});

module.exports = router;