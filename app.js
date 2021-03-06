//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");

const app = express();

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// let posts = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initialing DB ----------------------------------------

mongoose.connect("mongodb+srv://admin-soham:Lptmx5BnWF4y34d@cluster0.h1bt9.mongodb.net/blogDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const postSchema = {
  title: String,
  content: String,
};

let listName = "POST";

var Post = mongoose.model(listName, postSchema);

// -----------------------------------------------------

app.get("/", function (req, res) {
  Post.find(function (err, posts) {
    //reading the data
    if (err) {
      console.log(err);
    } else {
      console.log("DB posts fetched successfully for HOME PAGE");
    }

    res.render("home", { startingContent: homeStartingContent, posts: posts });
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactPara: contactContent });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutPara: aboutContent });
});

app.get("/compose", function (req, res) {
  // when loading the compose page
  res.render("compose");
});

app.post("/compose", function (req, res) {
  // when clicked on compose
  let postTitle = req.body.postTitle;
  let postContent = req.body.postContent;

  const post = new Post({
    title: postTitle,

    content: postContent,
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  console.log(req.params);

  let postId = req.params.postId;

  let found = false;

  Post.findOne({ _id: postId }, function (err, post) {
    if (err) {
      console.log(err);
    } else {
      console.log("searched post found");
      found = true;
      console.log(post);
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    }

    if (found == false) {
      console.log("not found");
    }
  });

  // for (let i = 0; i < posts.length; i++) {
  //   if (posts[i].postTitle == _.lowerCase(req.params.postTitle)) {
  //     found = true;
  //     res.render("post", {
  //       title: posts[i].postTitle,
  //       content: posts[i].postContent,
  //     });
  //   }
  // }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
