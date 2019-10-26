require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = "./models";

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/scrape", function(req, res) {
  axios
    .get("https://techcrunch.com/")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $("a.post-block__title__link").each(function(i, element) {
        var title = $(element)
          .text()
          .trim();
        var link = $(element).attr("href");

        console.log(title, link);
      });

      res.sendStatus(200);
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.listen(PORT, function() {
  const HOST = process.env.HOST || "http://localhost";
  console.log(`App running on ${HOST}:${PORT}`);
});
