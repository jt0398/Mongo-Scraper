var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  url: String,
  img: String,
  summary: String,
  date: Date,
  author: String
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
