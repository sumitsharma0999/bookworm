var express = require('express');
var auth = require('./api/auth');
var users = require('./api/users');
var books = require('./api/books');
var router = express.Router();

router.use('/users', users);
router.use('/books', books);

module.exports = router;
