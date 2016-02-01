var express = require('express');
var router = express.Router();
var BookHelper = require('../scripts/bookHelper');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Are you a bookworm ?' , starterFile: 'scripts/Home.View'});
});

/* Sign up page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Create Account' , starterFile: 'scripts/SignUp.View'});
});

/* Sign In page. */
router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Log in to bookworm account' , starterFile: 'scripts/SignIn.View'});
});

/* Sign In page. */
router.get('/myBooks', function(req, res, next) {
    BookHelper.getBooksForUser().then(function(availableBooks) {
        res.render('myBooks', { title: 'My books', myBooksData: JSON.stringify(availableBooks)});
	}, function(error) {
        res.redner('error');
    });
});



module.exports = router;
