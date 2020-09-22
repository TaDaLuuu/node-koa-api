const path = require("path");

const BASE_PATH = path.join(__dirname, "src", "server", "db");

module.exports = {
  test: {
    client: "pg",
    connection: "postgres://postgres@localhost:5432/koa_api_test",
    migrations: {
      directory: path.join(BASE_PATH, "migrations"),
    },
  },
  development: {
    client: "pg",
    connection: "postgres://postgres@localhost:5432/koa_api",
    migrations: {
      directory: path.join(BASE_PATH, "migrations"),
    },
  },
};
