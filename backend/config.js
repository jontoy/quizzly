/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const PORT = +process.env.PORT || 3001;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - else: 'quizzly'

let DB_URI;

DB_URI = process.env.DATABASE_URL || "quizzly";

module.exports = {
  PORT,
  DB_URI,
};
