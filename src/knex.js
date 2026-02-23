const path = require("path");
const config = require("../knexfile");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
console.log("+++++++++++++++++", config[process.env.NODE_ENV]);
const knex = require("knex")(config[process.env.NODE_ENV]);
module.exports = knex;
