var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Article.find({})
      .sort({ date: -1 })
      .then(dbArticles => {
        res.render("index", { articles: dbArticles });
      });
  });

  app.get("/api/scrape", function(req, res) {
    var promises = [];

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

          console.log(title);

          promises.push(
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
            )
          );
        });

        return Promise.all(promises)
          .then(dbArticles => {
            res.json({ count: dbArticles.length });
          })
          .catch(error => console.log(error));
      })
      .catch(error => {
        console.log(error);
        res.sendStatus(400);
      });
  });

  app.post("/api/articles", function(req, res) {});
};
