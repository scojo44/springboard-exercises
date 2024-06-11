/** Message class for message.ly */

const ExpressError = require("../expressError");
const db = require("../db");

/** Message on the site. */

class Message {
  constructor(id, from_user, to_user, body, sent_at = null, read_at = null) {
    this.id = id;
    this.from_user = from_user;
    this.to_user = to_user;
    this.body = body;
    this.sent_at = sent_at;
    this.read_at = read_at;
  }

  /** Update read_at for message */

  async markRead() {
    this.read_at = new Date();
    return await this.save();
  }

  /** Save message to the database */

  async save() {
    const result = await db.query(
     `UPDATE messages SET read_at = $2
      WHERE id = $1
      RETURNING id, read_at`,
      [this.id, this.read_at]
    );

    return true;
  }

  /** register new message -- returns
   *    {id, from_username, to_username, body, sent_at}
   */

  static async create({from_username, to_username, body}) {
    const result = await db.query(
     `INSERT INTO messages (from_username, to_username, body, sent_at)
      VALUES ($1, $2, $3, current_timestamp)
      RETURNING id, from_username, to_username, body, sent_at`,
      [from_username, to_username, body]
    );

    return Message.fromDBRow(result.rows[0]);
  }

  /** Generate new message object from db result row -- returns
   *    Message {id, User {from_user}, User {to_username}, body, sent_at}
   */

  static async fromDBRow({id, from_username, to_username, body, sent_at, read_at = null}) {
    const User = require('./user');
    const from_user = await User.get(from_username);
    const to_user = await User.get(to_username);
    return new Message(id, from_user, to_user, body, sent_at, read_at);
  }

  /** Get: get message by id
   *
   * returns {id, from_user, to_user, body, sent_at, read_at}
   *
   * both to_user and from_user = {username, first_name, last_name, phone}
   */

  static async get(id) {
    const result = await db.query(
     `SELECT id, from_username, to_username, body, sent_at, read_at
      FROM messages
      WHERE id = $1`,
      [id]
    );

    if(!result.rows[0])
      throw new ExpressError(`No such message: ${id}`, 404);

    return Message.fromDBRow(result.rows[0]);
  }
}

module.exports = Message;
