define(function(require) {
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

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function getCurrentUser() {
        return  {
            userId: readCookie("bookwormCurrentUser")
        };
    }

    return {
        sendAuthorisedRequest: sendAuthorisedRequest,
        getCurrentUser: getCurrentUser
    };
});
