var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Note = require("./Note");

var SavedArticleSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  url: String,
  img: String,
  summary: String,
  date: Date,
  author: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

SavedArticleSchema.pre("remove", async function(next) {
  console.log(this.notes);
  await Note.deleteMany({ _id: { $in: this.notes } }).exec();
});

var SavedArticle = mongoose.model("SavedArticle", SavedArticleSchema);

module.exports = SavedArticle;
