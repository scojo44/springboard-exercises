/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
  }

  /** find all customers. */

  static async all(search) {
    let where = '';
    const params = [];

    // Build search SQL and parameters
    if(search) {
      where = `WHERE first_name ILIKE $1 OR last_name ILIKE $1`;
      params.push(`%${search}%`);
    }

    const results = await db.query(
      `SELECT id,
         first_name AS "firstName",
         last_name AS "lastName",
         phone,
         notes
       FROM customers
       ${where}
       ORDER BY last_name, first_name`,
       params
    );
    return results.rows.map(c => new Customer(c));
  }

  static async top(count) {
    const results = await db.query(
      `SELECT c.id,
         c.first_name AS "firstName",
         c.last_name AS "lastName",
         c.phone,
         c.notes,
         count(r.customer_id) AS "resCount"
       FROM customers c
       JOIN reservations r on r.customer_id = c.id
       GROUP BY r.customer_id, c.id, c.first_name, c.last_name, c.phone, c.notes
       ORDER BY count(r.customer_id) DESC
       LIMIT ${+count}`
    );

    return results.rows.map(c => {
        const entry = new Customer(c);
        entry.resCount = c.resCount;
        return entry;
    });
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  /** return the customer's full name. */
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** save this customer. */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers SET first_name=$1, last_name=$2, phone=$3, notes=$4
             WHERE id=$5`,
        [this.firstName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }
}

module.exports = Customer;
