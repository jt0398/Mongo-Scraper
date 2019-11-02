var db = require("../models");

module.exports = function(app) {
  app.get("/savedarticles", function(req, res) {
    db.SavedArticle.find({})
      .sort({ date: -1 })
      .then(dbSavedArticles => {
        res.render("savedArticles", { articles: dbSavedArticles });
      });
  });

  app.delete("/api/savedarticles/delete", async function(req, res) {
    const id = req.body.id;

    try {
      const dbArticle = await db.SavedArticle.find({ _id: id }).exec();

      const { title, url, img, summary, date, author } = dbArticle[0];

      await db.Article.create({
        title,
        url,
        img,
        summary,
        date,
        author
      });

      await db.SavedArticle.deleteOne({ _id: id }).exec();

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });

  app.get("/api/savedarticles/:id/notes", async function(req, res) {
    const id = req.params.id;

    const dbArticle = await db.SavedArticle.findById(id, "title")
      .populate("notes")
      .exec();

    res.json(dbArticle);
  });

  app.post("/api/savedarticles/notes", async function(req, res) {
    const id = req.body.id;
    const notes = req.body.notes;

    const dbNote = await db.Note.create({ body: notes });

    const dbArticle = await db.SavedArticle.findOneAndUpdate(
      { _id: id },
      { $push: { notes: dbNote._id } },
      { new: true }
    ).exec();

    res.sendStatus("200");
  });

  app.delete("/api/savedarticles/notes/:id/delete", function(req, res) {
    const id = req.params.id;

    db.Note.deleteOne({ _id: id }).then(() => {
      res.sendStatus(200);
    });
  });
};
