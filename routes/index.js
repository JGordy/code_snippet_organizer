const express = require("express");
const User = require("../models/user");
const Snippet = require("../models/snippets")
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// mongoose.connect("mongodb://localhost:27017/codeSnippets");

const requireLogin = function (req, res, next) {
  if (req.user) {
    // console.log(req.user)
    next()
  } else {
    res.redirect('/');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/user")
  } else {
    next();
  }
};


router.get("/", login, function(req, res) {


  res.render("signup", {
      messages: res.locals.getMessages()
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email
  }).then(function(data) {
    console.log(data);
    res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/signup");
  });
});

router.get("/user", requireLogin, function(req, res) {
  Snippet.find({})
    .then(function(data) {
      currentUser = req.user;
      res.render("user", {snippets: data, username: req.user.username})
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
});

router.get("/create", requireLogin, function(req, res) {
  res.render("createSnippet", {username: req.user.username});
})

// "javascript fun test hello"
router.post("/save", requireLogin, function(req, res) {
  let arr = req.body.tags.split(" ");

   Snippet.create({
     username: req.user.username,
     title: req.body.title,
     code: req.body.code,
     notes: req.body.notes,
     language: req.body.language,
     tags: arr
   }).then(function(data) {
     console.log(data);
     res.redirect("/user");
   }).catch(function(err) {
     console.log(err);
     res.redirect("/create");
   });
});

router.get("/singleSnippet/:id", function(req, res) {

  Snippet.find({_id: req.params.id}).sort("name")
    .then(function(users) {
      // console.log(users);
      res.render("singleSnippet", {snippets: users, username: req.user.username})
    })
    .catch(function(err) {
      console.log(err);
      // next(err);
    });
});

router.get("/language/:language", function(req, res) {
  Snippet.find({language: req.params.language})
    .then(function(data) {

      res.render("user", {snippets: data, username: req.user.username})
    .catch(function(err) {

      res.redirect("/user");
      })
    })
});

router.get("/tags/:tags", function(req, res) {

  Snippet.find({tags: req.params.tags})
    .then(function(data) {

      res.render("user", {snippets: data, username: req.user.username})
    .catch(function(err) {

      res.redirect("/user");
      })
    })
});

router.get("/remove/:id", function(req, res) {
  let reqId = req.params.id;
  console.log("reqId: ", reqId);
  // let newId = reqId.substr(1);
  Snippet.remove({ _id: reqId }, function(err) {
      if (!err) {
        console.log("Yay");
      }
      else {
        console.log(err);
      }
  });
  res.redirect("/user");
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
