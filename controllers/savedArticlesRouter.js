var db = require("../models");

module.exports = function(app) {
  app.get("/savedarticles", function(req, res) {
    db.SavedArticle.find({})
      .sort({ date: -1 })
      .then(dbSavedArticles => {
        res.render("savedArticles", { articles: dbSavedArticles });
      });
  });

  app.delete("/api/savedarticles/delete", function(req, res) {
    const id = req.params.id;
  });
};
