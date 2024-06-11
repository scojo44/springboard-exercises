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

      response.body.users.forEach(u => t.fixQuotedDatesInUser(u));

      expect(response.body).toEqual({users: t.users});
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

      t.fixQuotedDatesInUser(response.body.user);

      expect(response.body).toMatchObject({user: t.user1});
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

      response.body.messages.forEach(m => t.fixQuotedDatesInMessage(m));

      expect(response.body).toEqual({
        messages: [{
          id: t.message2.id,
          from_user: t.user2,
          to_user: t.user1,
          body: t.message2.body,
          sent_at: expect.any(Date),
          read_at: null
        }]
      });
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

      response.body.messages.forEach(m => t.fixQuotedDatesInMessage(m));

      expect(response.body).toEqual({
        messages: [{
          id: t.message1.id,
          from_user: t.user1,
          to_user: t.user2,
          body: t.message1.body,
          sent_at: expect.any(Date),
          read_at: null
        }]
      });
    });

    t.expectUnauthorizedFromWrongUsersGet(`user's sent messages`, '/users/test1/from');
  });
});
