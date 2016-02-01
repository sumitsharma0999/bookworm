define(function (require) {

    function SignInViewModel() {
        this.userName = ko.observable("");
        this.password = ko.observable("");
        this.errorMessage = ko.observable(null);
    }

    SignInViewModel.prototype.sendRequest = function sendRequest() {
        if(this.userName() &&
          this.password()) {
                $.post("/api/users/authenticate",
                    {
                        userName: this.userName(),
                        password: this.password()
                    }).done(function(response) {
                        // Set the cookie here to store the token
                        document.cookie = "bookworm_token="+response.token;
                        window.location.assign("/myBooks");
                    }.bind(this)
                ).fail(function(response) {
                    var error = JSON.parse(response.responseText);
                    this.errorMessage(error && error.message ? error.message : "An error occured");
                }.bind(this));
        }
    };

    return {
        SignInViewModel: SignInViewModel
    };
});
