define(function (require) {
    var Utils = require("Utils");

    function AddBookViewModel() {
        this.bookId = ko.observable("");
        this.ownerId = ko.observable(Utils.getCurrentUser().userId);
        this.city = ko.observable("");
        this.latitude = ko.observable("");
        this.longitude = ko.observable("");
        this.errorMessage = ko.observable(null);
        this.addSuccess=ko.observable(false);
    }

    AddBookViewModel.prototype.reset = function reset(clearSuccessFlag) {
        this.bookId("");
        this.city("");
        this.longitude("");
        this.latitude("");

        if(clearSuccessFlag) {
            this.addSuccess(false);
        }
    };

    AddBookViewModel.prototype.sendRequest = function sendRequest() {
        if(this.bookId() &&
          this.ownerId() &&
          this.city() &&
          this.latitude() &&
          this.longitude()) {
                $.ajax({
                    type: "POST",
                    url: "/api/books/availableBooks/add",
                    data: JSON.stringify({
                        bookId: this.bookId(),
                        providerId: this.ownerId(),
                        location: {
                            city: this.city(),
                            latitude: this.latitude(),
                            longitude: this.longitude()
                        }}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function(response) {
                        this.errorMessage(null);
                        this.reset();
                        this.addSuccess(true);
                    }.bind(this)
                ).fail(function(response) {
                    var error = JSON.parse(response.responseText);
                    this.errorMessage(error && error.message ? error.message : "An error occured");
                }.bind(this));
        }
    };

    return {
        AddBookViewModel: AddBookViewModel
    };
});
