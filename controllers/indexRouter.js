var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

var Moment = require("moment");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Article.find({})
      .sort({ date: -1 })
      .then(dbArticles => {
        dbArticles.map(article => {
          return Moment(article.date).format("MM/DD/YYYY");
        });

        console.log(dbArticles);
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

          console.log(title, Moment(date).format("MM/DD/YYYY"));

          promises.push(
            db.Article.findOneAndUpdate(
              { title: title },
              {
                title: title,
                url: url,
                img: img,
                summary: summary,
                date: Moment(date).format("MM/DD/YYYY"),
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

  app.post("/api/articles", function(req, res) {
    const id = req.body.id;

    async () => {
      try {
        const dbArticle = await db.Article.find({ _id: id });
        const { title, url, img, summary, date, author } = dbArticle;
        await db.SavedArticle.create({
          title,
          url,
          img,
          summary,
          date,
          author
        });
        db.Article.deleteOne({ _id: id });

        res.sendStatus(200);
      } catch (error) {
        res.sendStatus(400);
      }
    };
  });
};
