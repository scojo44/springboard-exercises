const request = require("supertest");

const app = require("../app");
const t = require("./testSetup");

afterAll(async () => await t.closeDB());

describe("User Routes Test", () => {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());
    
  /** GET /messages/1 => message  */

  describe("GET /messages/1", () => {
    test("can get message details for sent message", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .get(`/messages/${t.message1.id}`)
        .query({_token: token});
      expect(response.body.id).toEqual(t.message1.id);
      expect(response.body.body).toEqual(t.message1.body);
      expect(response.body.from_user.username).toEqual(t.user1.username);
      expect(response.body.to_user.username).toEqual(t.user2.username);
    });

    test("can get message details for received message", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .get(`/messages/${t.message2.id}`)
        .query({_token: token});
      expect(response.body.id).toEqual(t.message2.id);
      expect(response.body.body).toEqual(t.message2.body);
      expect(response.body.from_user.username).toEqual(t.user2.username);
      expect(response.body.to_user.username).toEqual(t.user1.username);
    });

    t.expectUnauthorizedFromWrongUsersGet(`user's message details`, `/messages/1`);
  });

  /** POST /messages => message  */

  describe("POST /messages", () => {
    test("can send a message", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .post('/messages')
        .send({
          _token: token,
          to_username: t.user3.username,
          body: 'u1-to-u3'
        });
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        from_username: t.user1.username,
        to_username: t.user3.username,
        body: 'u1-to-u3'
        // sent_at will come back in quotes so expect.any(Date) won't work
      });
    });

    t.expectUnauthorizedFromAnonUserPost(`send a message`, '/messages');
  });

  /** POST /messages/2/read => [msg1, msg2, ...]  */

  describe("POST /messages/2/read", () => {
    test("can mark received message as read", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .post('/messages/2/read')
        .send({_token: token});
      expect(response.body.id).toEqual(t.message2.id);
      expect(new Date(response.body.read_at)).toBeInstanceOf(Date);
    });

    test(`can't mark sent message as read`, async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .post('/messages/1/read')
        .send({_token: token});
      expect(response.statusCode).toEqual(401);
    });

    test(`can't mark not-involved message as read`, async () => {
      const token = await t.logInUser('test3');
      const response = await request(app)
        .post('/messages/1/read')
        .send({_token: token});
      expect(response.statusCode).toEqual(401);
    });

    t.expectUnauthorizedFromAnonUserPost(`mark a message as read`, '/messages/1/read');
  });
});
