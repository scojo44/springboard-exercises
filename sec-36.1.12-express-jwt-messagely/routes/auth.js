const express = require('express');
const ExpressError = require('../expressError');
const User = require('../models/user');

const router = new express.Router();

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
  try {
    // Register the new user and log them in
    const user = await User.register(req.body);
    const token = await user.login();
    return res.json({token});
  }
  catch (error) {
    // Check for the Postgres error code for 'primary key already exists'
    if(error.code === '23505')
      return next(new ExpressError(`Sorry, username ${req.body.username} is already taken.`, 400));

    return next(error);
  }
});

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const user = await User.get(username);

    // Authenticate the login and update the login timestamp
    if(await user.authenticate(password)) {
      const token = await user.login();
      return res.json({token});
    }

    throw new ExpressError('Invalid username & password', 400)
  }
  catch (error) {
    if(error.status === 404) // User not found should come back as invalid password
      error = new ExpressError('Invalid username & password', 400);
    return next(error);
  }
});

module.exports = router;
