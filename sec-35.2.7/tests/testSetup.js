const db = require('../db');

class TestSetup {
  async initDB() {
    // Create sample companies
    let result = await db.query(`
      INSERT INTO companies (code, name, description)
      VALUES
        ('acme', 'Acme Gadgets Corp', 'Best gadgets to capture road runners'),
        ('widget', 'Widgets Inc.', NULL)
      RETURNING *
    `);

    [this.acme, this.widget] = result.rows;

    // Create sample invoices
    result = await db.query(`
      INSERT INTO invoices (comp_Code, amt, paid, paid_date)
      VALUES
        ('acme', 100, false, NULL),
        ('acme', 200, false, NULL),
        ('widget', 300, true, '2018-01-01'),
        ('widget', 400, false, NULL)
      RETURNING *
    `);

    const [iAcme1, iAcme2, iWidget1, iWidget2] = result.rows;
    this.invAcme1 = iAcme1;
    this.invWidget1 = iWidget1;

    // Create sample companies that include invoices
    this.acmeFull = {...this.acme, invoices: [iAcme1, iAcme2]};
    this.widgetFull = {...this.widget, invoices: [iWidget1, iWidget2]};
  }

  async clearDB() {
    await db.query('DELETE FROM invoices');
    await db.query('DELETE FROM companies');
  }

  async closeDB() {
    await db.end();
  }

  // Remove quotes around invoice dates in returned invoice
  fixInvoiceDatesArray(invoices) {
    return invoices.map(i => {
      this.fixInvoiceDates(i);
      return i;
    });
  }
  fixInvoiceDates(inv) {
    inv.add_date = inv.add_date? new Date(inv.add_date) : null;
    inv.paid_date = inv.paid_date? new Date(inv.paid_date) : null;
    return inv;
  }
}

module.exports = new TestSetup();
