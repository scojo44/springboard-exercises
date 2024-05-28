process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const t = require('./testSetup');

beforeEach(async () => await t.initDB());
afterEach(async () => await t.clearDB());
afterAll(async () => await t.closeDB());

describe("GET /companies", () => {
  test('Gets all items, returning {items: [item1, ...]}', async () => {
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({companies: [t.acme, t.widget]});
  });
});

describe('GET /companies/:code', () => {
  test('Gets a single company by name, returning {code, name, description}', async () => {
    const res = await request(app).get('/companies/acme');
    res.body.company.invoices = t.fixInvoiceDatesArray(res.body.company.invoices);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({company: t.acmeFull});
  });

  test("Responds with 404 if invalid code", async function() {
    const res = await request(app).get(`/companies/xyzzy`);
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /companies', () => {
  test('Creates new company, returning {added: company}', async () => {
    const shinra = {name: 'Shinra Inc.', description: null};
    const res = await request(app).post('/companies').send(shinra);
    shinra.code = 'shinra-inc.'; // Add slugified code to sample company
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({company: shinra});
  });

  test("Responds with 400 if no properties", async function() {
    const shinra = {};
    const res = await request(app).post('/companies').send(shinra);
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if wrong properties", async function() {
    const shinra = {title: 'Shinra Inc.'};
    const res = await request(app).post('/companies').send(shinra);
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /companies/:code', () => {
  test('Updates existing company, returning {company: company}', async () => {
    const newWidget = {name: 'Widgets & More Inc.', description: 'Great widgets and so much more!'};
    const res = await request(app).put('/companies/widget').send(newWidget);

    // Update sample company with new info
    t.widget.name = newWidget.name;
    t.widget.description = newWidget.description;

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({company: t.widget});
  });

  test("Responds with 404 if invalid code", async function() {
    const res = await request(app).put(`/companies/xyzzy`).send({code: 'xyzzy', name: 'Nothing Happens'});
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /companies/:code", () => {
  test('Deletes existing company, returning {message: "Deleted company"}', async () => {
    const res = await request(app).delete('/companies/widget');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({status: 'Deleted company ' + t.widget.code});
  });

  test("Responds with 404 if invalid code", async function() {
    const res = await request(app).delete(`/companies/xyzzy`);
    expect(res.statusCode).toBe(404);
  });
});
