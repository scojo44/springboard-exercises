/** User class for message.ly */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../db");
const ExpressError = require("../expressError");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config');

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // Save the new user to the database
    const result = await db.query(
     `INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
      VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
      RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]);

    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    try {
      const result = await db.query(
        `SELECT password FROM users
         WHERE username = $1`,
         [username]);
      const user = result.rows[0];

      return user && await bcrypt.compare(password, user.password);
    }
    catch {
      return false; // Treat nonexistent user the same as a wrong password
    }
  }

  /** Log in the user.  Returns token containing the username */

  static async login(username) {
    await User.updateLoginTimestamp(username);
    const token = await jwt.sign({username}, SECRET_KEY);
    return token;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
     `UPDATE users SET last_login_at = current_timestamp
      WHERE username = $1
      RETURNING username, last_login_at`,
      [username]);

    if(!result.rows[0])
      throw new ExpressError(`Error saving login timestamp for user: ${username}`, 400);

    return result.rows[0];
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(
     `SELECT username, first_name, last_name, phone
      FROM users`);

    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
     `SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1`,
      [username]);

    if(result.rows.length === 0)
      throw new ExpressError(`No such user: ${username}`, 404);

    return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const user = await User.get(username);
    const results = await db.query(
      `SELECT m.id, m.body, m.sent_at, m.read_at, u.username, u.first_name, u.last_name, u.phone
       FROM messages m
       JOIN users u ON u.username = m.to_username
       WHERE m.from_username = $1`,
       [username]);
 
     return results.rows.map(r => {
       return {
         id: r.id,
         body: r.body,
         sent_at: r.sent_at,
         read_at: r.read_at,
         to_user: {
           username: r.username,
           first_name: r.first_name,
           last_name: r.last_name,
           phone: r.phone
         }
       }
     })
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const user = await User.get(username);
    const results = await db.query(
     `SELECT m.id, m.body, m.sent_at, m.read_at, u.username, u.first_name, u.last_name, u.phone
      FROM messages m
      JOIN users u ON u.username = m.from_username
      WHERE m.to_username = $1`,
      [username]);

    return results.rows.map(r => {
      return {
        id: r.id,
        body: r.body,
        sent_at: r.sent_at,
        read_at: r.read_at,
        from_user: {
          username: r.username,
          first_name: r.first_name,
          last_name: r.last_name,
          phone: r.phone
        }
      }
    })
  }
}

module.exports = User;
