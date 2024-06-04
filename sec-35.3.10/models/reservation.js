/** Reservation for Lunchly */
const moment = require("moment");
const ExpressError = require("../expressError");
const db = require("../db");

/** A reservation for a party */

class Reservation {
  constructor({id, customerID, numGuests, startAt, notes}) {
    this.#id = id;
    this.#customerID = customerID;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** Properties */

  #id;
  get id() { return this.#id; }

  #customerID;
  get customerID() { return this.#customerID; }

  #numGuests;
  get numGuests() { return this.#numGuests; }
  set numGuests(n) {
    if(n <= 0)
      throw new ExpressError("Need at least one guest", 400);
    if(n > 200)
      throw new ExpressError("Number of guests exceeds our building's maximum capacity.", 400);
    this.#numGuests = n;
  }

  #startAt;
  get startAt() { return this.#startAt; }
  set startAt(d) {
    if(!d instanceof Date)
      throw new ExpressError("startAt must be a Date object", 400);
    this.#startAt = d;
  }

  #notes;
  get notes() { return this.#notes; }
  set notes(n) {
    this.#notes = n || '';
    this.save();
  }

  get formattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  get timeSince() {
    return moment(this.startAt).fromNow();
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerID, limit) {
    let limitClause = '';

    if(limit)
      limitClause = `LIMIT ${limit}`;

    const results = await db.query(
        `SELECT id, 
           customer_id AS "customerID", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1
         ORDER BY start_at DESC
         ${limitClause}`,
        [customerID]
    );

    return results.rows.map(row => new Reservation(row));
  }

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO reservations (customer_id, start_at, num_guests, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [this.customerID, this.startAt, this.numGuests, this.notes]
      );
      this.#id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE reservations SET customer_id=$1, start_at=$2, num_guests=$3, notes=$4
         WHERE id=$5`,
        [this.customerID, this.startAt, this.numGuests, this.notes, this.id]
      );
    }
  }
}


module.exports = Reservation;
