var exports = {};

exports.addGoogleUser = function(request, accessToken, refreshToken, profile) {
	console.log("inside addGoogleUser");
    console.log(request);
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
}

module.exports = exports;