/** Customer for Lunchly */
const db = require("../db");
const ExpressError = require("../expressError");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, middleName, lastName, phone, notes }) {
    this.#id = id;
    this.#firstName = firstName;
    this.#middleName = middleName || '';
    this.#lastName = lastName;
    this.#phone = phone || '';
    this.#notes = notes;
  }

  /** Properties */

  #id;
  get id() { return this.#id; }

  #firstName;
  get firstName() { return this.#firstName; }
  set firstName(name) {
    this.#firstName = name || '';
    this.save();
  }

  #middleName;
  get middleName() { return this.#middleName; }
  set middleName(name) {
    this.#middleName = name || '';
    this.save();
  }

  #lastName;
  get lastName() { return this.#lastName; }
  set lastName(name) {
    this.#lastName = name || '';
    this.save();
  }

  #phone;
  get phone() { return this.#phone; }
  set phone(ph) {
    this.#phone = ph || '';
    this.save();
  }

  #notes;
  get notes() { return this.#notes; }
  set notes(n) {
    this.#notes = n || '';
    this.save();
  }

  get fullName() {
    return `${this.firstName} ${this.middleName} ${this.lastName}`.replace('  ', ' '); // If middleName is empty, remove the resulting double space
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** get the most recent reservation for this customer. */

  async getLastReservation() {
    const last = await Reservation.getReservationsForCustomer(this.id, 1);
    return last.length > 0? last[0] : null;
  }

  /** save this customer. */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, middle_name, last_name, phone, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [this.firstName, this.middleName, this.lastName, this.phone, this.notes]
      );
      this.#id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers SET first_name=$1, middle_name=$2, last_name=$3, phone=$4, notes=$5
         WHERE id=$6`,
        [this.firstName, this.middleName, this.lastName, this.phone, this.notes, this.id]
      );
    }
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
         middle_name AS "middleName",
         last_name AS "lastName",
         phone,
         notes
       FROM customers
       ${where}
       ORDER BY last_name, first_name`,
       params
    );

    // Add the most recent reservation to each customer
    const customers = [];
    for(const row of results.rows) {
      const customer = new Customer(row);
      customer.lastReservation = await customer.getLastReservation();
      customers.push(customer);
    }

    return customers;
  }

  static async top(count) {
    const results = await db.query(
      `SELECT c.id,
         c.first_name AS "firstName",
         c.middle_name AS "middleName",
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
        const customer = new Customer(c);
        customer.resCount = c.resCount;
        return customer;
    });
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id,
         first_name AS "firstName",
         middle_name AS "middleName",
         last_name AS "lastName",
         phone,
         notes
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      throw new ExpressError(`No such customer: ${id}`, 404);
    }

    return new Customer(customer);
  }
}

module.exports = Customer;
