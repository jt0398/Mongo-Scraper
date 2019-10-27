require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/scrape", function(req, res) {
  axios
    .get("https://techcrunch.com/")
    .then(function(response) {
      const $ = cheerio.load(response.data);

      $(".post-block").each(function(i, element) {
        const title = $(element)
          .find("header h2 a")
          .text()
          .trim();

        const url = $(element)
          .find("header h2 a")
          .attr("href")
          .trim();

        const img = $(element)
          .find("footer figure a img")
          .attr("src")
          .trim();

        const summary = $(element)
          .find("div.post-block__content")
          .text()
          .trim();

        const date = $(element)
          .find("div time")
          .text()
          .trim();

        const author = $(element)
          .find("span.river-byline__authors a")
          .text()
          .trim();

        console.log(title, url, img, summary, date, author);

        db.Article.findOneAndUpdate(
          { title: title },
          {
            title: title,
            url: url,
            img: img,
            summary: summary,
            date: date,
            author: author
          },
          {
            new: true,
            upsert: true
          }
        ).then(dbArticle => {
          console.log(dbArticle);
        });
      });

      res.sendStatus(200);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(400);
    });
});

app.listen(PORT, function() {
  const HOST = process.env.HOST || "http://localhost";
  console.log(`App running on ${HOST}:${PORT}`);
});
