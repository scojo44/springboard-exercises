/** User class for message.ly */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../db");
const ExpressError = require("../expressError");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config');

/** User of the site. */

class User {
  constructor({username, password, first_name, last_name, phone, join_at = null, last_login_at = null}) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.join_at = join_at;
    this.last_login_at = last_login_at;
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  async authenticate(password) {
    try {
      return await bcrypt.compare(password, this.password);
    }
    catch {
      return false; // Treat nonexistent user the same as a wrong password
    }
  }

  /** Log in the user.  Returns token containing the username */

  async login() {
    await this.updateLoginTimestamp();
    const token = await jwt.sign({username: this.username}, SECRET_KEY);
    return token;
  }

  /** Update last_login_at for user */

  async updateLoginTimestamp() {
    this.last_login_at = new Date();
    return await this.save();
  }

  /** Save user to the database */

  async save() {
    const result = await db.query(
     `UPDATE users SET password=$2, first_name=$3, last_name=$4, phone=$5, last_login_at=$6
      WHERE username = $1
      RETURNING username, password, first_name, last_name, phone, last_login_at`,
      [this.username, this.password, this.first_name, this.last_name, this.phone, this.last_login_at]
    );

    if(!result.rows[0])
      throw new ExpressError(`No such user: ${this.username}`, 404);

    return true;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  async messagesFrom() {
    const results = await db.query(
     `SELECT id, to_username, body, sent_at, read_at
      FROM messages
      WHERE from_username = $1`,
      [this.username]
    );
 
    const Message = require('./message');

    const promisedMessages = results.rows.map(async r => {
      const toUser = await User.get(r.to_username);
      return new Message(r.id, this, toUser, r.body, r.sent_at, r.read_at);
    });

    return await Promise.all(promisedMessages);
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  async messagesTo() {
    const results = await db.query(
     `SELECT id, from_username, body, sent_at, read_at
      FROM messages
      WHERE to_username = $1`,
      [this.username]
    );

    const Message = require('./message');

    const promisedMessages = results.rows.map(async r => {
      const fromUser = await User.get(r.from_username);
      return new Message(r.id, fromUser, this, r.body, r.sent_at, r.read_at);
    });

    return await Promise.all(promisedMessages);
  }

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    // Save the new user to the database
    const result = await db.query(
     `INSERT INTO users (username, password, first_name, last_name, phone, join_at)
      VALUES ($1, $2, $3, $4, $5, current_timestamp)
      RETURNING username, password, first_name, last_name, phone, join_at`,
      [username, await User.hashPassword(password), first_name, last_name, phone]
    );

    return new User(result.rows[0]);
  }

  /** Hash the password */

  static async hashPassword(password) {
    return await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...]
   */

  static async all() {
    const results = await db.query(
     `SELECT username, password, first_name, last_name, phone, join_at, last_login_at
      FROM users
      ORDER BY username`
    );

    return results.rows.map(r => new User(r));
  }

  /** Get: get user by username
   *
   * returns {username, first_name, last_name, phone, join_at, last_login_at}
   */

  static async get(username) {
    const result = await db.query(
     `SELECT username, password, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1`,
      [username]
    );

    if(result.rows.length === 0)
      throw new ExpressError(`No such user: ${username}`, 404);

    return new User(result.rows[0]);
  }
}

module.exports = User;
