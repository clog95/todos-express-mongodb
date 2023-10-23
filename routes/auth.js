var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const User = require('../app/models/User');
var router = express.Router();

// Configure Passport strategy for authenticating with a username and password.
passport.use(new LocalStrategy(function verify(username, password, cb) {
  User.findOne({ username: username })
    .then(user => {
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, user);
      });
    }).catch(() => cb(null, false, { message: 'Incorrect username or password.' }));
}));

// Configure session management
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { _id: user._id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.get('/user/login', function(req, res, next) {
  res.render('login');
});

router.post('/user/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/user/login',
  failureMessage: true
}));

router.post('/user/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/user/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/user/signup', function(req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    req.body.hashed_password = hashedPassword;
    req.body.salt = salt;
    var newUser = new User(req.body);
    newUser.save()
      .then((newUser) => {
        var user = {
          _id: newUser._id,
          username: req.body.username
        };
        req.login(user, function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      }).catch();

  });
});

module.exports = router;
