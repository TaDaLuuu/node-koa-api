const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");

const indexRoutes = require("./routes/index");

const store = require("./session");

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(cors());
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
