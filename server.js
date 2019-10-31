require("dotenv").config();

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(error => {
    console.log(error);
  });

mongoose.set("useCreateIndex", true);

mongoose.connection.on("error", error => {
  console.log(error);
});

require("./controllers/indexRouter")(app);

app.listen(PORT, function() {
  const HOST = process.env.HOST || "http://localhost";
  console.log(`App running on ${HOST}:${PORT}`);
});
