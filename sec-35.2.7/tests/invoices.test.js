process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const t = require('./testSetup');

beforeEach(async () => await t.initDB());
afterEach(async () => await t.clearDB());
afterAll(async () => await t.closeDB());

describe("GET /invoices", () => {
  test('Gets all items, returning {items: [item1, ...]}', async () => {
    const res = await request(app).get('/invoices');
    res.body.invoices = t.fixInvoiceDatesArray(res.body.invoices);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({invoices: [...t.acmeFull.invoices, ...t.widgetFull.invoices]});
  });
});

describe('GET /invoices/:id', () => {
  test('Gets a single invoice by ID, returning {invoice: {id, amt, paid, add_date, paid_date, company }', async () => {
    const res = await request(app).get(`/invoices/${t.invAcme1.id}`);
    res.body.invoice = t.fixInvoiceDates(res.body.invoice);
    res.body.invoice.company = this.acme;
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({invoice: t.invAcme1});
  });

  test("Responds with 404 if invalid code", async function() {
    const res = await request(app).get(`/invoices/0`);
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /invoices', () => {
  test('Creates new invoice, returning {added: invoice}', async () => {
    const rocket = {comp_code: 'acme', amt: 19.95};
    const res = await request(app).post('/invoices').send(rocket);
    expect(res.statusCode).toBe(201);
    expect(res.body.invoice.comp_code).toEqual(rocket.comp_code);
    expect(res.body.invoice.amt).toEqual(rocket.amt);
  });

  test("Responds with 400 if no company code", async function() {
    const rocket = {amt: 19.95};
    const res = await request(app).post('/invoices').send(rocket);
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if no amount", async function() {
    const rocket = {comp_code: 'acme'};
    const res = await request(app).post('/invoices').send(rocket);
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if no properties", async function() {
    const rocket = {};
    const res = await request(app).post('/invoices').send(rocket);
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if wrong properties", async function() {
    const rocket = {company_id: 'acme', amount: 19.95};
    const res = await request(app).post('/invoices').send(rocket);
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /invoices/:id', () => {
  test('Updates existing unpaid invoice amount, returning {invoice: invoice}', async () => {
    const invUpdate = {amt: 395};
    const res = await request(app).put(`/invoices/${t.invAcme1.id}`).send(invUpdate);
    res.body.invoice = t.fixInvoiceDates(res.body.invoice);
    t.invAcme1.amt = invUpdate.amt; // Update original sample invoice for comparison
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({invoice: t.invAcme1});
  });

  test('Updates existing paid invoice amount, returning {invoice: invoice}', async () => {
    const invUpdate = {amt: 395};
    const res = await request(app).put(`/invoices/${t.invWidget1.id}`).send(invUpdate);
    res.body.invoice = t.fixInvoiceDates(res.body.invoice);
    t.invWidget1.amt = invUpdate.amt; // Update original sample invoice for comparison
    expect(res.statusCode).toBe(200);
    expect(res.body.invoice.paid_date).toEqual(t.invWidget1.paid_date);
    expect(res.body).toEqual({invoice: t.invWidget1});
  });

  test('Updates existing invoice as paid, returning {invoice: invoice}', async () => {
    const paid = {paid: true};
    const res = await request(app).put(`/invoices/${t.invAcme1.id}`).send(paid);
    expect(res.statusCode).toBe(200);
    expect(res.body.invoice.paid).toBe(true);
    expect(new Date(res.body.invoice.paid_date)).toEqual(expect.any(Date));
  });

  test('Updates existing invoice as unpaid, returning {invoice: invoice}', async () => {
    const paid = {paid: false};
    const res = await request(app).put(`/invoices/${t.invWidget1.id}`).send(paid);
    expect(res.statusCode).toBe(200);
    expect(res.body.invoice.paid).toBe(false);
    expect(res.body.invoice.paid_date).toBeNull();
  });

  test("Responds with 404 if invalid code", async function() {
    const res = await request(app).put(`/invoices/0`).send({amt: 999});
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /invoices/:id", () => {
  test('Deletes existing invoice, returning {message: "Deleted invoice #id"}', async () => {
    const res = await request(app).delete(`/invoices/${t.invWidget1.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({status: 'Deleted invoice #' + t.invWidget1.id});
  });

  test("Responds with 404 if invalid code", async function() {
    const res = await request(app).delete(`/invoices/0`);
    expect(res.statusCode).toBe(404);
  });
});
