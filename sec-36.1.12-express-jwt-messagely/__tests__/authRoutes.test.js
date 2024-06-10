const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const t = require('./testSetup')

afterAll(async () => await t.closeDB());

describe("Auth Routes Test", function () {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());
    
  /** POST /auth/register => token  */

  describe("POST /auth/register", function () {
    test("can register", async function () {
      const response = await request(app)
        .post("/auth/register")
        .send({
          username: "bob",
          password: "secret",
          first_name: "Bob",
          last_name: "Smith",
          phone: "+14150000000"
        });

        const token = response.body.token;
      expect(jwt.decode(token)).toEqual({
        username: "bob",
        iat: expect.any(Number)
      });
    });
  });

  /** POST /auth/login => token  */

  describe("POST /auth/login", function () {
    test("can login", async function () {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "test1", password: "password" });

        const token = response.body.token;
      expect(jwt.decode(token)).toEqual({
        username: "test1",
        iat: expect.any(Number)
      });
    });

    test("won't login w/wrong password", async function () {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "test1", password: "WRONG" });
      expect(response.statusCode).toEqual(400);
    });

    test("won't login w/wrong password", async function () {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "not-user", password: "password" });
      expect(response.statusCode).toEqual(400);
    });
  });
});
