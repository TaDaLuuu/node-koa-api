const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const passport = require("koa-passport");

const indexRoutes = require("./routes/index");

const store = require("./session");

const app = new Koa();
const PORT = process.env.PORT || 1337;

// sessions
app.keys = ["super-secret-key"];
app.use(session({ store }, app));

// body parser
app.use(bodyParser());

// routes
app.use(indexRoutes.routes());

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
