const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const config = require("../knexfile");

// ← ここが超重要
const env = process.env.NODE_ENV || "development";

console.log("+++++++++++++++++", config[env]);

const knex = require("knex")(config[env]);
module.exports = knex;
