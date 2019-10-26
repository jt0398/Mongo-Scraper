require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");
var mongojs = require("mongoose");

var db = "./models";

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.listen(PORT, function() {
  const HOST = process.env.HOST || "http://localhost";
  console.log(`App running on ${HOST}:${PORT}`);
});
