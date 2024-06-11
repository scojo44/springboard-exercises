const t = require("./testSetup");
const db = require('../db');
const User = require("../models/user");

afterAll(async () => await t.closeDB());

describe("Test User class", function () {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());

  test("can register", async function () {
    const user = {
      username: "joel",
      password: "password",
      first_name: "Joel",
      last_name: "Burton",
      phone: "+14155551212",
    };
    const newUser = await User.register(user);

    delete user.password; // newUser will have password hash instead
    expect(newUser).toMatchObject(user);
    expect(newUser.password).toMatch(/^\$.*/); // Bcrypt hash
  });

  test("can authenticate", async function () {
    let isValid = await t.user1.authenticate("password");
    expect(isValid).toBeTruthy();

    isValid = await t.user1.authenticate("xxx");
    expect(isValid).toBeFalsy();
  });


  test("can update login timestamp", async function () {
    await db.query("UPDATE users SET last_login_at=NULL WHERE username='test1'");
    expect(t.user1.last_login_at).toBeNull();

    t.user1.updateLoginTimestamp();
    expect(t.user1.last_login_at).toBeInstanceOf(Date);
  });

  test("can get", async function () {
    const user = await User.get("test1");
    expect(user).toEqual(t.user1);
  });

  test("can get all", async function () {
    const user = await User.all();
    expect(user).toEqual(t.users);
  });
});

describe("Test messages part of User class", function () {
  beforeEach(async () => await t.initDB());
  afterEach(async () => await t.clearDB());

  test('can get messages from user', async function () {
    const messages = await t.user1.messagesFrom();
    expect(messages).toEqual([t.message1]);
  });

  test('can get messages to user', async function () {
    const messages = await t.user1.messagesTo();
    expect(messages).toEqual([t.message2]);
  });
});
