/* This file contains the data format for the rest apis */
var Exceptions = require('../common/exceptions');
var GeoLocationHelper = require('geoLocationHelper');

/* Search result entity
e.g.
{
    "availableBookRecordId": "ISBN:89343943943",
    "location": {
        "city": "Delhi",
        "longitude": 70.123456,
        "latitude": 67.000000
    }
    "distance": 2000    // In meters
}
*/

function SearchResultEntity(availableBookRecordId, distantPlace) {
    // distantPlace is of type GeoLocationHelper.DistantPlace
    this.availableBookRecordId = availableBookRecordId;
    this.location = distantPlace.location;
    this.distance = distantPlace.distance;
}

/* Search Response : Array of Search Result Entities sorted by distance
e.g.
{
    [
        {
            availableBookRecordId": "ISBN:89343943943",
            "location": {
                "city": "Delhi",
                "longitude": 70.123456,
                "latitude": 67.000000
            }
            "distance": 2000    // In meters
        }
    ]
}
*/
function SearchResponse(searchResultEntities) {
    // distantPlaces is an array of searchResultEntities
    this.searchResultEntities = searchResultEntities;
}

module.exports = {
    SearchResponse: SearchResponse
}

