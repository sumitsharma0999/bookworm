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

/* Show my books. */
router.get('/myBooks', function(req, res, next) {
    BookHelper.getBooksForUser().then(function(availableBooks) {
        res.render('myBooks', { title: 'My books', starterFile: 'scripts/MyBooks.View', myBooksData: JSON.stringify(availableBooks)});
	}, function(error) {
        res.redner('error');
    });
});

/* Add book page. */
router.get('/add', function(req, res, next) {
    if(user) {
        res.render('addBook');
    }
    else {
        res.status(401);
        res.json("You should be logged in");
    }
});

router.get('/search', function(req, res, next) {
    res.render('search', { title:'Find you favorite books nearby', starterFile: 'scripts/Search.View'});
});



module.exports = router;
