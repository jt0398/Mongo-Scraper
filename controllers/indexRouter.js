var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

var Moment = require("moment");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Article.find({})
      .sort({ date: -1 })
      .then(dbArticles => {
        /*   dbArticles.map(article => {
          return Moment(article.date).format("MM/DD/YYYY");
        }); */

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
          .then(() => {
            return db.Article.find({}).then(dbArticles => {
              console.log(dbArticles.length);
              res.json({ count: dbArticles.length });
            });
          })
          .catch(error => console.log(error));
      })
      .catch(error => {
        console.log(error);
        res.sendStatus(400);
      });
  });

  app.post("/api/articles", async function(req, res) {
    const id = req.body.id;

    try {
      const dbArticle = await db.Article.find({ _id: id }).exec();

      const { title, url, img, summary, date, author } = dbArticle[0];

      await db.SavedArticle.create({
        title,
        url,
        img,
        summary,
        date,
        author
      });

      await db.Article.deleteOne({ _id: id }).exec();

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });

  app.delete("/api/articles", async function(req, res) {
    try {
      await db.Note.deleteMany({});
      await db.SavedArticle.deleteMany({});
      await db.Article.deleteMany({});

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });
};
