define(function (require) {

    function SearchViewModel() {
        this.bookId = ko.observable("");
        this.city = ko.observable("");
        this.latitude = ko.observable("");
        this.longitude = ko.observable("");

        this.searchResults = ko.observableArray();
        this.errorMessage = ko.observable(null);
    }

    SearchViewModel.prototype.clearResults = function clearResults() {
        this.searchResults.removeAll();
    };

    SearchViewModel.prototype.setSearchResults = function setSearchResults(searchResults) {
        for(var i=0; i<searchResults.length; i++) {
            this.searchResults.push({
                providerId: searchResults[i].providerId,
                distance: searchResults[i].distance
            })
        }
    };

    SearchViewModel.prototype.performSearch = function sendRequest() {
        // clear the error message first.
        this.errorMessage(null);

        if(this.bookId() &&
          this.city() &&
          this.latitude() &&
          this.longitude()) {
                $.get(this.getSearchUrl())
                    .done(function(response) {
                        // clear the existing results
                        this.clearResults();
                        this.setSearchResults(response);
                    }.bind(this)
                ).fail(function(response) {
                    var error = JSON.parse(response.responseText);
                    this.errorMessage(error && error.message ? error.message : "An error occured");
                }.bind(this));
        }
        else {
            this.errorMessage("All the fields are mandatory");
        }
    };

    SearchViewModel.prototype.getSearchUrl = function getSearchUrl() {
        return "/api/books/search?bookId="+this.bookId()+"&city="+this.city()+"&longitude="+this.longitude()+"&latitude="+this.latitude();
    }

    return {
        SearchViewModel: SearchViewModel
    };
});
