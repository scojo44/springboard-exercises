const t = require("./testSetup");
const db = require('../db');
const User = require("../models/user");
const Message = require("../models/message");

afterAll(async () => await t.closeDB());

describe("Test User class", function () {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());

  test("can register", async function () {
    const u = await User.register({
      username: "joel",
      password: "password",
      first_name: "Joel",
      last_name: "Burton",
      phone: "+14155551212",
    });

    expect(u.username).toBe("joel");
    expect(u.password).not.toBe(undefined);
  });

  test("can authenticate", async function () {
    let isValid = await User.authenticate("test1", "password");
    expect(isValid).toBeTruthy();

    isValid = await User.authenticate("test1", "xxx");
    expect(isValid).toBeFalsy();
  });


  test("can update login timestamp", async function () {
    await db.query("UPDATE users SET last_login_at=NULL WHERE username='test1'");
    const u1 = await User.get("test1");
    expect(u1.last_login_at).toBe(null);

    User.updateLoginTimestamp("test1");
    const u2 = await User.get("test1");
    expect(u2.last_login_at).not.toBe(null);
  });

  test("can get", async function () {
    let u = await User.get("test1");
    expect(u).toEqual({
      username: "test1",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155551111",
      last_login_at: expect.any(Date),
      join_at: expect.any(Date),
    });
  });

  test("can get all", async function () {
    const u = await User.all();
    expect(u).toEqual(t.users);
  });
});

describe("Test messages part of User class", function () {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());

  test('can get messages from user', async function () {
    let m = await User.messagesFrom("test1");
    expect(m).toEqual([{
      id: expect.any(Number),
      body: "u1-to-u2",
      sent_at: expect.any(Date),
      read_at: null,
      to_user: {
        username: "test2",
        first_name: "Test2",
        last_name: "Testy2",
        phone: "+14155552222",
      }
    }]);
  });

  test('can get messages to user', async function () {
    let m = await User.messagesTo("test1");
    expect(m).toEqual([{
      id: expect.any(Number),
      body: "u2-to-u1",
      sent_at: expect.any(Date),
      read_at: null,
      from_user: {
        username: "test2",
        first_name: "Test2",
        last_name: "Testy2",
        phone: "+14155552222",
      }
    }]);
  });
});
