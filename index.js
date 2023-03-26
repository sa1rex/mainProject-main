const debug = require("debug")("index");

require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const indexRoutes = require("./routes/route.js");
var expressLayouts = require("express-ejs-layouts");
const sql = require("mssql");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const config = require("./config");

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.text());

app.set("view engine", "ejs");
require("./routes/auth/passport")(passport);

app.use(expressLayouts);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      // 2 days
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/", indexRoutes);

app.use(express.static("public"));

async function start() {
  await sql
    .connect(config)
    .then(function (pool) {
      console.log("Microsoft SQL Server connected");
      return pool;
    })
    .catch(function (err) {
      console.error("MSSQL Connection Error");
      throw err;
    });
  app.listen(port, () =>
    console.log(
      `Your RESTAURANT app listening on port ${port}.\nTry opening your browser to http://localhost:${port}`
    )
  );
}

start();
