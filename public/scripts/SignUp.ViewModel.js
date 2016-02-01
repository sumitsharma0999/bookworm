define(function (require) {

    function SignUpViewModel() {
        this.userName = ko.observable("");
        this.email = ko.observable("");
        this.password = ko.observable("");
        this.confirmPassword = ko.observable("");
        this.phoneNumber = ko.observable("");
        this.registerationSuccessful = ko.observable(false);
        this.errorMessage = ko.observable(null);
    }

    SignUpViewModel.prototype.sendRequest = function sendRequest() {
        if(this.userName() &&
          this.email() &&
          this.password() &&
          this.confirmPassword() &&
          this.password() === this.confirmPassword() &&
          this.phoneNumber()) {
                $.post("/api/users/addUser",
                    {
                        userName: this.userName(),
                        email: this.email(),
                        password: this.password(),
                        phoneNumber: this.phoneNumber()
                    }).done(function(response) {
                        this.errorMessage(null);
                        this.registerationSuccessful(true);
                    }.bind(this)
                ).fail(function(response) {
                    var error = JSON.parse(response.responseText);
                    this.errorMessage(error && error.message ? error.message : "An error occured");
                }.bind(this));
        }
    };

    return {
        SignUpViewModel: SignUpViewModel
    };
});
