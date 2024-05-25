process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app');
const items = require('./fakeDB');

const skirt = {name: 'skirt', price: 5.99};
const dress = {name: 'dress', price: 9.99};

beforeEach(() => {
  items.push(skirt);
  items.push(dress);
});

afterEach(() => {
  while(items.length)
    items.pop();
});

describe("GET /items", () => {
  test('Gets all items, returning {items: [item1, ...]}', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([skirt, dress]);
  });
});

describe('GET /items/:name', () => {
  test('Gets a single item by name, returning {name, price}', async () => {
    const res = await request(app).get('/items/skirt');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(skirt);
  });

  test("Responds with 404 if invalid name", async function() {
    const res = await request(app).get(`/items/blouse`);
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /items', () => {
  test('Creates new item, returning {added: item}', async () => {
    const blouse = {name: 'blouse', price: 7.99};
    const res = await request(app).post('/items').send(blouse);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({added: blouse});
  });

  test("Responds with 400 if no name", async function() {
    const blouse = {price: 7.99};
    const res = await request(app).post('/items').send(blouse);
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if no price", async function() {
    const blouse = {name: 'blouse'};
    const res = await request(app).post('/items').send(blouse);
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if no name or price", async function() {
    const blouse = {};
    const res = await request(app).post('/items').send(blouse);
    expect(res.statusCode).toBe(400);
  });

  test("Responds with 400 if wrong properties", async function() {
    const blouse = {product: 'blouse', cost: 7.99};
    const res = await request(app).post('/items').send(blouse);
    expect(res.statusCode).toBe(400);
  });
});

describe('PATCH /items/:name', () => {
  test('Updates existing item, returning {item: item}', async () => {
    const sundress = {name: 'sundress', price: 9.99};
    const res = await request(app).patch('/items/dress').send(sundress);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({updated: sundress});
  });

  test("Responds with 404 if invalid name", async function() {
    const res = await request(app).patch(`/items/nylons`).send({price: 4.99});
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test('Deletes existing item, returning {message: "Deleted item"}', async () => {
    const res = await request(app).delete('/items/skirt');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({message: 'Deleted ' + skirt.name});
  });

  test("Responds with 404 if invalid name", async function() {
    const res = await request(app).delete(`/items/pumps`);
    expect(res.statusCode).toBe(404);
  });
});
