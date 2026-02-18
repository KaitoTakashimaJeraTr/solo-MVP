const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
console.log("---------------------", process.env.POSTGRES_PASSWORD);

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.POSTGRES_HOST || "localhost",
      user: process.env.POSTGRES_USER || "JERA_DevPC",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB || "calorie_app",
      port: process.env.POSTGRES_PORT || 5432,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
