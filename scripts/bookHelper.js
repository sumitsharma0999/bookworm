var Exceptions = require('../common/exceptions');
var AvailableBook = require('../models/AvailableBook');
var BookTransaction = require('../models/BookTransaction');
var GeoLocationHelper = require('./geoLocationHelper');
var Q = require('q');

function addBookToAvailableBooks(book) {
    var deferred = Q.defer();

    // Given the AvailableBook object, adds the given book to list of available books
	if(book) {
        book.save(function(err) {
            if (err) {
                deferred.reject(err);
		    }

		    console.log('Book "' + book.bookId + '" added with providerId "' + book.providerId + '"');
            deferred.resolve();
	  	});
	}
    else {
        deferred.reject(Exceptions.DataInvalidException("Book data is invalid"));
    }

    return deferred.promise;
}

function getBooksForUser(user) {
    var deferred = Q.defer();

    // TODO: return only the books added by user
    AvailableBook.find({}).lean().exec(function(err, availableBooks) {
        if(err) {
            deferred.reject(err);
        }
        deferred.resolve(availableBooks);
    });

    return deferred.promise;
}

function getAvailableBookFromJson(jsonObj) {
	// Parses the jsonObj to check if it is in valid format
	if(jsonObj)
	{
		if(jsonObj.bookId &&
           jsonObj.providerId &&
           jsonObj.location &&
           jsonObj.location.city &&
           jsonObj.location.longitude &&
           jsonObj.location.latitude) {
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
    else {
	   throw new Exceptions.DataInvalidException("The provided data for adding book is incorrect");
    }
}

function getBookTransactionFromJson(jsonObj, availableBookRecordId) {
	// Parses the jsonObj to check if it is in valid format and returns a promise for BookTransaction object
    var deferred = Q.defer();
	if(jsonObj)
	{
		if(availableBookRecordId) {
            // Retrieve more details about the available book
            AvailableBook.findOne({'_id': availableBookRecordId}, function(err, availableBook) {
		      if(err) {
                  deferred.reject(new Exceptions.DataInvalidException("The requested book could not be found"));
              }
              // We found the record
              
              if(jsonObj.requesterId &&
                    jsonObj.location &&
                    jsonObj.location.city &&
                    jsonObj.location.longitude &&
                    jsonObj.location.latitude) {
                        
                    // Make sure that requestor's city and provider's city are same
                    if(jsonObj.location.city !== availableBook.location.city) {
                        deferred.reject(Exceptions.DataInvalidException("You can not request across cities"));  
                    }   
                                         
                    deferred.resolve(new BookTransaction({
                        bookId: availableBook.bookId,
                        providerId: availableBook.providerId,
                        requesterId: jsonObj.requesterId,
                        sourceLocation: availableBook.location,
                        destinationLocation: jsonObj.location
                    }));  
              }
              else {
                deferred.reject(new Exceptions.DataInvalidException("The provided data for requesting book is incorrect"));
              }
	        });
        }
    }
    else {	
	   deferred.reject(new Exceptions.DataInvalidException("The provided data for requesting book is incorrect"));
    }
    
    return deferred.promise;
}

function getAvailableBookRecordIdFromJson(jsonObj) {
    if(jsonObj) {
		return jsonObj.availableBookRecordId;
    }
}

function addBookTransaction(transaction, availableBookRecordId) {
    // Given the BookTransaction object, adds the given transaction to list of transactions
    // And removes the book from list of available books
    // Works on promise basis
    
    var deferred = Q.defer();
	if(transaction) {
	  	transaction.save(function(err) {
		    if (err) {
		    	deferred.reject(err);
		    }
            
            // Remove the book from available books,
            // We should fail if this step fails
            AvailableBook.findByIdAndRemove(availableBookRecordId, function(err) {
                if(err) {
                    deferred.reject(err);
                }
                console.log('Requestor "' + transaction.requesterId + '" requested book "' + transaction.bookId + '" from provider "' + transaction.providerId + '"');
                deferred.resolve();
            });        
	  	});
	}
    else {
        deferred.reject("");
    }
    
    return deferred.promise;
}

/* Search Request
e.g.
{
    "bookId": "ISBN:89343943943",
    "location": {
        "city": "Delhi",
        "longitude": 70.123456,
        "latitude": 67.000000
    }
    "maxDistance": 2000    // In meters
}
*/
function SearchRequest(bookId, city, longitude, latitude, maxDistance) {
    this.bookId = bookId;
    this.maxDistance = maxDistance || SearchRequest.prototype.defaultMaxDistance;
    this.location = {};
    this.location.city = city;
    this.location.longitude = longitude;
    this.location.latitude = latitude;
}

SearchRequest.defaultMaxDistance = 3000;

// Takes query parameters object and creates a SearchRequest object from it
// Throws error if data is not in valid format
SearchRequest.prototype.fromQueryParams = function fromJSON(queryParams) {
    if(queryParams) {
        if(queryParams.bookId &&
           queryParams.city &&
           queryParams.longitude &&
           queryParams.latitude
        // && queryParams.maxDistance   // maxDistance is an optional parameter
        ) {
            return new SearchRequest(queryParams.bookId,
                queryParams.city,
                parseFloat(queryParams.longitude),
                parseFloat(queryParams.latitude),
                parseFloat(queryParams.maxDistance));
        }
    }
    throw new Exceptions.DataInvalidException("Invalid Search Request");
};

/*
 Search for given book near given location, in the given city, within given distance.
 Returns promise to give array of locations with distance (sorted by distance)
*/
function getSearchResults(searchRequest) {
    var deferred = Q.defer();
    
    if(searchRequest) {
        // Get available books with given id which are in the same city, and select their record id and locations.
        // 'lean' is required to convert from Mongoose model objects into normal javascript objects
        AvailableBook.find({'bookId': searchRequest.bookId, 'location.city': searchRequest.location.city}, '_id location providerId').lean().exec(function(err, results){
           if(err) {
               deferred.reject("Internal Server Error");
           }
           
           var closePlaces = GeoLocationHelper.findClosePlaces(searchRequest, results, SearchRequest.defaultMaxDistance);
           deferred.resolve(closePlaces);
        });
    }
    else {
        deferred.reject("Invalid request");
    }
    
    return deferred.promise;
}

module.exports = {
    getBooksForUser: getBooksForUser,
    addBookToAvailableBooks: addBookToAvailableBooks,
    getAvailableBookFromJson: getAvailableBookFromJson,
    getBookTransactionFromJson: getBookTransactionFromJson,
    getAvailableBookRecordIdFromJson: getAvailableBookRecordIdFromJson,
    addBookTransaction: addBookTransaction,
    SearchRequest: SearchRequest,
    getSearchResults: getSearchResults
};
