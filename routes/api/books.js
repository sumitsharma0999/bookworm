var express = require('express');
var AvailableBook = require('../../models/AvailableBook');
var BookTransaction = require('../../models/BookTransaction');
var Exceptions = require('../../common/exceptions');
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
		book = getAvailableBookFromJson(req.body);
	}
	catch (exception) {
		// Invalid book data
		res.status(400);
		res.json(exception.message);
		return;
	}
    try {
        addBookToAvailableBooks(book);
        res.json({ success: true });
    }
    catch(error) {
        res.status(500);
        res.json(error);
    }
});

function addBookToAvailableBooks(book) {
    // Given the jsonObj for book, adds the given book to list of available books
	if(book) {
	  	book.save(function(err) {
		    if (err) {
		    	throw err;
		    }

		    console.log('Book "' + book.bookId + '" added with providerId "' + book.providerId + '"');
	  	});
	}
}

function getAvailableBookFromJson(jsonObj) {
	// Parses the jsonObj to check if it is in valid format
	if(jsonObj)
	{
		if(jsonObj.bookId
			&& jsonObj.providerId
			&& jsonObj.location
			&& jsonObj.location.city
			&& jsonObj.location.longitude
			&& jsonObj.location.latitude) {
			return new AvailableBook({
				bookId: jsonObj.bookId,
				providerId: jsonObj.providerId,
				location: {
					city: jsonObj.location.city,
					longitude: jsonObj.location.longitude,
					latitude: jsonObj.location.latitude,
				}
			});
		}
	}
	throw new Exceptions.DataInvalidException("The provided data for adding book is incorrect");
}

router.get('/BookTransaction', function(req, res, next) {
	BookTransaction.find({}, function(err, transactions) {
		res.json(transactions);
	});
});

module.exports = router;
