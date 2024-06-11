const request = require("supertest");

const app = require("../app");
const t = require("./testSetup");
const Message = require('../models/message');

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

      t.fixQuotedDatesInMessage(response.body.message);

      expect(response.body).toEqual({
        message: {
          id: t.message1.id,
          from_user: t.user1,
          to_user: t.user2,
          body: t.message1.body,
          sent_at: expect.any(Date),
          read_at: null
        }
      });
    });

    test("can get message details for received message", async () => {
      const token = await t.logInUser();
      const response = await request(app)
        .get(`/messages/${t.message2.id}`)
        .query({_token: token});

      t.fixQuotedDatesInMessage(response.body.message);

      expect(response.body).toEqual({
        message: {
          id: t.message2.id,
          from_user: t.user2,
          to_user: t.user1,
          body: t.message2.body,
          sent_at: expect.any(Date),
          read_at: null
        }
      });
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

      t.fixQuotedDatesInMessage(response.body.message);

      expect(response.body).toEqual({
        message: {
          id: expect.any(Number),
          from_user: t.user1,
          to_user: t.user3,
          body: 'u1-to-u3',
          sent_at: expect.any(Date),
          read_at: null
        }
      });
    });

    t.expectUnauthorizedFromAnonUserPost(`send a message`, '/messages');
  });

  /** POST /messages/2/read => [msg1, msg2, ...]  */

  describe("POST /messages/2/read", () => {
    test("can mark received message as read", async () => {
      const token = await t.logInUser();
      expect(t.message2.read_at).toBeNull();

      // Mark message as read
      const response = await request(app)
        .post(`/messages/${t.message2.id}/read`)
        .send({_token: token});

      t.fixQuotedDates(response.body, 'read_at');
      const updated = await Message.get(t.message2.id);

      expect(response.body.id).toBe(t.message2.id);
      expect(response.body.read_at).toBeInstanceOf(Date);
      expect(updated.read_at).toBeInstanceOf(Date);
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
