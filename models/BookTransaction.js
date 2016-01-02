// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('BookTransaction', new Schema({ 
    bookId: String,
    providerId: String,
    requesterId: String,
    initiationTime: { type: Date, default: Date.now },
    state: { type: String, default: "Requested" },
    sourceLocation: {
    	city: String,
    	latitude: Number,
    	longitude: Number
    },
    destinationLocation: {
    	city: String,
    	latitude: Number,
    	longitude: Number
    }
}));