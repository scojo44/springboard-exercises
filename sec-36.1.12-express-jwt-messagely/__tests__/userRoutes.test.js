const request = require("supertest");

const app = require("../app");
const t = require("./testSetup");

afterAll(async () => await t.closeDB());

describe("User Routes Test", () => {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());
    
  /** GET / => [user1, user2, ...]  */

  describe("GET /users", () => {
    test("can get all users", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .get('/users')
        .query({_token: token});
      expect(response.body).toEqual(t.users);
    });

    test("can't get all users w/o login", async () => {
      const response = await request(app)
        .get('/users');
      expect(response.statusCode).toEqual(401);
    });
  });

  /** GET /user1 => user1  */

  describe("GET /users/test1", () => {
    test("can get own user details", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .get('/users/test1')
        .query({_token: token});
      expect(response.body).toMatchObject(t.user1); // Ignore last_login and join_at dates
    });

    t.expectUnauthorizedFromWrongUsersGet(`user's details`, '/users/test1');
  });

  /** GET /user1/to => [msg1, msg2, ...]  */

  describe("GET /users/test1/to", () => {
    test("can get own received messages", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .get('/users/test1/to')
        .query({_token: token});
      expect(response.body[0].id).toEqual(t.message2.id);
      expect(response.body[0].body).toEqual(t.message2.body);
    });

    t.expectUnauthorizedFromWrongUsersGet(`user's received messages`, '/users/test1/to');
  });

  /** GET /user1/from => [msg1, msg2, ...]  */

  describe("GET /users/test1/from", () => {
    test("can get own sent messages", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .get('/users/test1/from')
        .query({_token: token});
      expect(response.body[0].id).toEqual(t.message1.id);
      expect(response.body[0].body).toEqual(t.message1.body);
    });

    t.expectUnauthorizedFromWrongUsersGet(`user's sent messages`, '/users/test1/from');
  });
});
