const express = require('express');
const ExpressError = require('../expressError');
const {ensureLoggedIn, ensureCorrectUser} = require('../middleware/auth');
const User = require('../models/user');
const Message = require('../models/message');

const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const {id} = req.params;
    const message = await Message.get(id);

    // Show the message if the user is either the sender or recipient
    if([message.to_user.username, message.from_user.username].includes(req.user.username))
      return res.json(message);
    
    throw new ExpressError('Unauthorized', 401);
  }
  catch(e) {
    return next(e);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async (req, res, next) => {
  try {
    const message = await Message.create({from_username: req.user.username, ...req.body});
    return res.json(message);
  }
  catch(e) {
    return next(e);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
  try {
    const {id} = req.params;
    const message = await Message.get(id);

    // Mark the message as read if the user is the recipient
    if(req.user.username === message.to_user.username)
      return res.json(await Message.markRead(id));

    throw new ExpressError('Unauthorized', 401);
  }
  catch(e) {
    return next(e);
  }
});

module.exports = router;
