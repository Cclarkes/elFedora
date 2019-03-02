"use strict";

require('dotenv').config();

let port = process.env.PORT || 80;
if (port == null || port == "") {
  port = 8000;
}
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


app.listen(port);
console.log("Example app listening on port" + port); 

// Seperated Routes for each Resource
const menuRoutes = require("./routes/menu");
const cartRoutes = require("./routes/cart");
const smsRoutes = require("./routes/sms");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes user.js
app.use("/api/menu", menuRoutes(knex));
app.use("/api/cart", cartRoutes(knex));
app.use("/sms", smsRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});
