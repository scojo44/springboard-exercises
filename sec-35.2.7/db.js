/** Database setup for BizTime. */
const {Client} = require('pg');

const dbName = process.env.NODE_ENV === 'test'? 'biztime_test' : 'biztime';
const db = new Client({connectionString: `postgresql:///${dbName}`});
db.connect();

module.exports = db;
