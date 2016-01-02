var express = require('express');
var Q = require('q');
var AvailableBook = require('../../models/AvailableBook');
var BookTransaction = require('../../models/BookTransaction');
var Exceptions = require('../../common/exceptions');
var bookHelper = require('../../scripts/bookHelper');
var router = express.Router();

/* GET books listing. */
router.get('/availableBooks', function(req, res, next) {
	AvailableBook.find({}, function(err, availableBooks) {
		res.json(availableBooks);
	});
});

/* Add a new book */
router.post('/availableBooks/add', function(req, res, next) {
	var book;
	try {
		book = bookHelper.getAvailableBookFromJson(req.body);
	}
	catch (exception) {
		// Invalid book data
		res.status(400);
		res.json(exception.message);
		return;
	}
    try {
        bookHelper.addBookToAvailableBooks(book);
        res.json({ success: true });
    }
    catch(error) {
        res.status(500);
        res.json(error);
    }
});

/* Get all the transactions */
router.get('/BookTransaction', function(req, res, next) {
	BookTransaction.find({}, function(err, transactions) {
		res.json(transactions);
	});
});

/* Request for a book */
router.post('/request', function(req, res, next) {
    var availableBookRecordId = bookHelper.getAvailableBookRecordIdFromJson(req.body);
    var getTransactionPromise = bookHelper.getBookTransactionFromJson(req.body, availableBookRecordId);
    
    getTransactionPromise.then(function(transaction) {
        bookHelper.addBookTransaction(transaction, availableBookRecordId).then(function () {
            res.json({success: true});
        }, function(err) {
            res.status(500);
            res.json(err);
        });
    }, function (err) {
        // Invalid book data
		res.status(400);
		res.json(err.message);
    });
});

module.exports = router;
