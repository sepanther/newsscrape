var express = require("express");
var exphbs = require("express-handlebars")
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
 }
// Initialize Express
var app = express();

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater");

var articles = []

app.get("/", function(req, res) {
  db.Article.find({}, function(err, found) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("articles", { article: found })
    }
  })
})

app.get("/scrape", function(req, res) {
    axios.get("http://echojs.com/").then(function(response) {
        var $ = cheerio.load(response.data);
            // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {
            // Save an empty result object
            var result = {};
    
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");
    
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console
                articles.push(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
            });           
        })
        res.redirect("/");    
    })
})

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}, function(err, found) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(found);
      }
    })
  });

  // Route for getting all Articles from the db
app.get("/saved", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}, function(err, found) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(found);
    }
  })
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });