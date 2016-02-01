define(function(require) {
    var $ = require('./lib/jquery');
    function getSessionToken() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)bookworm_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    }

    function sendAuthorisedRequest(url, method, data) {

        var storedToken = document.cookie.replace(/(?:(?:^|.*;\s*)bookworm_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        var allowedMethods = ["GET", "POST"];

        if(url && method && allowedMethods.indexOf(method.toUpperCase() !== -1)) {
            // returns a promise
            return $.ajax({
                method: method,
                url: url,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                    "bookworm-access-token": storedToken
                }
            });
       }

    }

    return {
        sendAuthorisedRequest: sendAuthorisedRequest
    };
});
