var oauth = require('../../config/oauth');
var exports = module.exports = {};
var passport = require('passport');

exports.google = function(req, res, next) {
  	
};

exports.facebook = function(req, res, next) {
  res.render('index', { title: 'Facebook' });
};