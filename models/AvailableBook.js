// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('AvailableBook', new Schema({ 
    bookId: String,
    providerId: String,
    dateAdded: {type: Date, default: Date.now},
    location: {
    	city: String,
        longitude: Number,
    	latitude: Number
    }
}));