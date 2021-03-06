// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var handlebars = require("express-handlebars");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Snatches HTML from URLs
var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');

// Initialize Express
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
var dbUri = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines";

// if (process.env.MONGO_URI) {
// 	dbUri = process.env.MONGO_URI;
// }
mongoose.Promise = Promise;
mongoose.connect(dbUri);
var db = mongoose.connection;
// console.log(db);
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {

  //db.articles.drop();

  //grab the body of the html with request
  request("http://www.huffingtonpost.com/section/comedy", function(error, response, html) {
    //load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
      $("div.middle-rail h2").each(function(i, element) {
        var result = {};
        result.title = $(this).find("a.card__link").text();
        result.link = $(this).find("a.card__link").attr("href");
        result.photo = $(this).find("a.card__link").attr("src");

      // Using our Article model, create a new entry
      var entry = new Article(result);

      //save entry to the db
      entry.save(function(err, doc) {
        // Log error
        if (err) {
          console.log(err);
        }
      
      });

    });
  });
  // Tell browser we finished scraping the text
  console.log("Scrape Complete");
  res.redirect("/");

});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log error
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

app.get("/notes/:id", function(req, res){
  Note.findOne({"_id:": req.params.id})
  .populate("note")
  .exec(function(error, doc){
    if(error){
      console.log(error);
    }
    else{
      res.json(doc);
    }
  });
});

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log error
        if (err) {
          console.log(err);
        }
        else {
          //send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

var PORT = process.env.PORT || 3000;
// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});