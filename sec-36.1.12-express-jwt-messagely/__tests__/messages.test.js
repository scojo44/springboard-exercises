const t = require("./testSetup");
const db = require('../db');
const Message = require("../models/message");

afterAll(async () => await t.closeDB());

describe("Test Message class", function () {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());

  test("can create", async function () {
    let m = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "new"
    });

    expect(m).toEqual({
      id: expect.any(Number),
      from_username: "test1",
      to_username: "test2",
      body: "new",
      sent_at: expect.any(Date),
    });
  });

  test("can mark read", async function () {
    let m = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "new"
    });
    expect(m.read_at).toBe(undefined);

    Message.markRead(m.id);
    const result = await db.query(
     `SELECT read_at FROM messages
      WHERE id = $1`,
      [m.id]);

    expect(result.rows[0].read_at).toEqual(expect.any(Date));
  });

  test("can get", async function () {
    let u = await Message.get(1);
    expect(u).toEqual({
      id: expect.any(Number),
      body: "u1-to-u2",
      sent_at: expect.any(Date),
      read_at: null,
      from_user: {
        username: "test1",
        first_name: "Test1",
        last_name: "Testy1",
        phone: "+14155551111",
      },
      to_user: {
        username: "test2",
        first_name: "Test2",
        last_name: "Testy2",
        phone: "+14155552222",
      },
    });
  });
});
