/*
{
    location: {     // Current location
        city:
        longitude:
        latitude:
    },
    distance:      // From some location
}
*/

// For logic details, see http://zaemis.blogspot.in/2011/01/geolocation-search.html

// calculate distance between two lat/lon coordinates
function distance(latA, lonA, latB, lonB, units) {
    // Converts from degrees to radians.
    var deg2rad = function(degrees) {
        return degrees * Math.PI / 180;
    };
    
    units = units || "m";
    var radius =  units.toLowerCase() === "km".toLowerCase() ? 6371 : 6371000;
    var rLatA = deg2rad(latA);
    var rLatB = deg2rad(latB);
    var rHalfDeltaLat = deg2rad((latB - latA) / 2);
    var rHalfDeltaLon = deg2rad((lonB - lonA) / 2);

    return 2 * radius * Math.asin(Math.sqrt(Math.pow(Math.sin(rHalfDeltaLat), 2) +
        Math.cos(rLatA) * Math.cos(rLatB) * Math.pow(Math.sin(rHalfDeltaLon), 2)));
}

function findClosePlaces(source, places, maxDistance) {
    var results = [];
    
    if(places) {
        places.forEach(function (place, index){
            var dist = distance(source.location.latitude, source.location.longitude, place.location.latitude, place.location.longitude)
            if(dist <= maxDistance) {
                place["distance"] = dist;
                results.push(place);
            }
        });
    }
    // Sort places by distance
    results.sort(function(a ,b) {
        if(a.distance < b.distance) {
            return -1;
        }
        else if(a.distance > b.distance) {
            return 1;
        }
        return 0;
    });
    
    return results;
}

module.exports = {
    findClosePlaces: findClosePlaces
}