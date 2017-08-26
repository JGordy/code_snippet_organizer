const express = require("express");
const User = require("../models/user");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

mongoose.connect("mongodb://localhost:27017/codeSnippets");

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
  res.render("user", {username: req.user.username});
});

router.get("/create", requireLogin, function(req, res) {
  res.render("createSnippet", {username: req.user.username});
})

// router.get("/save", )

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
