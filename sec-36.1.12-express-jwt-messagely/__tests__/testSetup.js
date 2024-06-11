const request = require("supertest");

const app = require("../app");
const db = require("../db");
const User = require('../models/user');
const Message = require('../models/message');

class TestSetup {
  async initDB() {
    await this.clearDB();

    // Register three users
    this.user1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155551111",
    });
    this.user2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "Testy2",
      phone: "+14155552222",
    });
    this.user3 = await User.register({
      username: "test3",
      password: "password",
      first_name: "Test3",
      last_name: "Testy3",
      phone: "+14155553333",
    });

    // Create some messages
    this.message1 = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "u1-to-u2"
    });
    this.message2 = await Message.create({
      from_username: "test2",
      to_username: "test1",
      body: "u2-to-u1"
    });
  }

  get users() {
    return [this.user1, this.user2, this.user3];
  }

  async clearDB() {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");
  }

  async closeDB() {
    await db.end();
  }

  /** Tests routes as GET requested by a different user and a logged out user */

  async expectUnauthorizedFromWrongUsersGet(action, route) {
    test(`can't get other ${action}`, async () => {
      const token = await this.logInUser('test3');
      const response = await request(app)
        .get(route)
        .query({_token: token});
      expect(response.statusCode).toEqual(401);
    });

    test(`can't get ${action} w/o login`, async () => {
      const response = await request(app)
        .get(route);
      expect(response.statusCode).toEqual(401);
    });
  }

  /** Tests routes as POST requested by a  logged out user */

  async expectUnauthorizedFromAnonUserPost(action, route) {
    test(`can't ${action} w/o login`, async () => {
      const response = await request(app)
        .post(route);
      expect(response.statusCode).toEqual(401);
    });
  }

  /** Logs in a user and returns the token */

  async logInUser(username = 'test1', password = 'password') {
    const response = await request(app)
      .post("/auth/login")
      .send({username, password});
    
    // Update the last login field on the test user
    const login = await User.get(username);
    const user = this.users.find(u => u.username = username);
    user.last_login_at = login.last_login_at;

    return response.body.token;
  }

  /** Fix dates in response.body that come back as quoted strings. */

  fixQuotedDates(obj, key) {
    if(obj[key])
      obj[key] = new Date(obj[key]); // Use Date() to parse the quoted date string
  }

  fixQuotedDatesInUser(user) {
    this.fixQuotedDates(user, 'join_at');
    this.fixQuotedDates(user, 'last_login_at');
  }

  fixQuotedDatesInMessage(message) {
    this.fixQuotedDatesInUser(message.from_user);
    this.fixQuotedDatesInUser(message.to_user);
    this.fixQuotedDates(message, 'sent_at');
    this.fixQuotedDates(message, 'read_at');
  }
}

module.exports = new TestSetup();