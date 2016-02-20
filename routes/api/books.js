var express = require('express');
var Q = require('q');
var AvailableBook = require('../../models/AvailableBook');
var BookTransaction = require('../../models/BookTransaction');
var Exceptions = require('../../common/exceptions');
var BookHelper = require('../../scripts/bookHelper');
var router = express.Router();

/* GET books listing. */
router.get('/availableBooks', function(req, res, next) {
	BookHelper.getBooksForUser().then(function(availableBooks) {
		res.json(availableBooks);
	}, function(error) {
        res.json(error);
    });
});

/* Add a new book */
router.post('/availableBooks/add', function(req, res, next) {
	var book;
	try {
		book = BookHelper.getAvailableBookFromJson(req.body);
	}
	catch (exception) {
		// Invalid book data
		res.status(400);
		res.json(exception.message);
		return;
	}

    BookHelper.addBookToAvailableBooks(book).then(function(){
        res.json({ success: true });
    }).catch(function(error) {
        res.status(500);
        res.json(error);
    });
});

/* Get all the transactions */
router.get('/BookTransaction', function(req, res, next) {
	BookTransaction.find({}, function(err, transactions) {
		res.json(transactions);
	});
});

/* Request for a book */
router.post('/request', function(req, res, next) {
    var availableBookRecordId = BookHelper.getAvailableBookRecordIdFromJson(req.body);
    var getTransactionPromise = BookHelper.getBookTransactionFromJson(req.body, availableBookRecordId);
    
    getTransactionPromise.then(function(transaction) {
        BookHelper.addBookTransaction(transaction, availableBookRecordId).then(function () {
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

/*
Search for a book near given location, in the given city, within given distance.
The query string is part of url
*/
router.get('/search', function(req, res, next) {
    // Get the query parameters
    try {
        var searchReq = BookHelper.SearchRequest.prototype.fromQueryParams(req.query);
        var getResultsPromise = BookHelper.getSearchResults(searchReq); 
        getResultsPromise.then(function (results){
            res.json(results);
        }, function(err) {
            res.status(500);
            res.json(err);
        });
    }
    catch (error) {
        res.status(400);
        res.json(error.message);
    }
    
});

module.exports = router;
