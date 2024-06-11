const t = require("./testSetup");
const db = require('../db');
const Message = require("../models/message");

afterAll(async () => await t.closeDB());

describe("Test Message class", function () {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());

  test("can create", async function () {
    const message = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "new"
    });

    expect(message).toEqual({
      id: expect.any(Number),
      from_user: t.user1,
      to_user: t.user2,
      body: "new",
      sent_at: expect.any(Date),
      read_at: null
    });
  });

  test("can mark read", async function () {
    expect(t.message1.read_at).toBeNull();
    t.message1.markRead();

    // Get directly to the database
    const result = await db.query(
     `SELECT read_at FROM messages
      WHERE id = $1`,
      [t.message1.id]);

    expect(result.rows[0].read_at).toBeInstanceOf(Date);
  });

  test("can get", async function () {
    const message = await Message.get(1);
    expect(message).toEqual({
      id: expect.any(Number),
      from_user: t.user1,
      to_user: t.user2,
      body: "u1-to-u2",
      sent_at: expect.any(Date),
      read_at: null
    });
  });
});
