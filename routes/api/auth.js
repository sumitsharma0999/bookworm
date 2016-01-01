var express = require('express');
var oauth = require('../../config/oauth');
var passport = require('passport');
var oauthIds = require('../../config/oauth');
var users = require('../../scripts/users');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

// Passport setup
// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// 1. passport for google
passport.use(new GoogleStrategy({
    clientID:     oauthIds.google.clientId,
    clientSecret: oauthIds.google.clientSecret,
    callbackURL: "http://www.sumit.com/api/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      users.addGoogleUser(request, accessToken, refreshToken, profile);
      return done(null, profile);
 	});
  }
));

var router = express.Router();

router.use(passport.initialize());


// routes for social authentication
router.get('/google',
  passport.authenticate('google', { scope: 
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));
router.get( '/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

module.exports = router;