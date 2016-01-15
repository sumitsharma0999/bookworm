var express = require('express');
var users = require('./api/users');
var books = require('./api/books');
var router = express.Router();

router.use('/users', users);
router.use('/books', books);

module.exports = router;
